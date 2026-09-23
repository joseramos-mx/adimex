import { test, expect } from "@playwright/test"
import { mergeCartAttrs, type CartAttribute } from "../src/lib/attribution-attrs"

// Round-6 p2: si incoming trae meta_consent=false, el merge debe borrar
// las llaves de marketing (meta_fbp/fbc/user_agent/client_ip_address)
// aunque ya estuvieran en el carrito. Modela el flujo real:
//   1. Usuario acepta marketing → cart tiene fbp/fbc/UA/ip + meta_consent=true.
//   2. Usuario abre banner y rechaza marketing → sync manda meta_consent=false.
//   3. Al merge, las llaves de marketing deben desaparecer.

const attr = (key: string, value: string): CartAttribute => ({ key, value })

test.describe("mergeCartAttrs — comportamiento base", () => {
  test("preserva UTMs originales cuando incoming solo trae consent", () => {
    const existing = [
      attr("utm_source", "meta"),
      attr("utm_campaign", "octubre-plc"),
      attr("landing_url", "https://adimex.io/productos/plc-fl7"),
    ]
    const incoming = [attr("meta_consent", "true")]
    const merged = mergeCartAttrs(existing, incoming)

    expect(merged.map((a) => a.key).sort()).toEqual(
      ["landing_url", "meta_consent", "utm_campaign", "utm_source"].sort(),
    )
    expect(merged.find((a) => a.key === "utm_source")?.value).toBe("meta")
  })

  test("incoming sobrescribe existing con la misma key", () => {
    const existing = [attr("meta_fbc", "fb.1.111.old")]
    const incoming = [attr("meta_fbc", "fb.1.222.new")]
    const merged = mergeCartAttrs(existing, incoming)
    expect(merged.find((a) => a.key === "meta_fbc")?.value).toBe("fb.1.222.new")
  })
})

test.describe("mergeCartAttrs — revocación por meta_consent=false", () => {
  test("aceptar → rechazar: las llaves de marketing desaparecen", () => {
    // Estado tras "aceptar": UTMs + marketing IDs + meta_consent=true.
    const afterAccept: CartAttribute[] = [
      attr("utm_source", "meta"),
      attr("utm_campaign", "octubre-plc"),
      attr("meta_consent", "true"),
      attr("meta_fbp", "fb.1.111.aaa"),
      attr("meta_fbc", "fb.1.111.bbb"),
      attr("meta_user_agent", "Mozilla/5.0"),
      attr("meta_client_ip_address", "189.204.10.20"),
    ]
    // Incoming del sync que dispara el "rechazar".
    const revoke: CartAttribute[] = [attr("meta_consent", "false")]

    const merged = mergeCartAttrs(afterAccept, revoke)
    const keys = merged.map((a) => a.key)

    // Marketing keys borradas.
    expect(keys).not.toContain("meta_fbp")
    expect(keys).not.toContain("meta_fbc")
    expect(keys).not.toContain("meta_user_agent")
    expect(keys).not.toContain("meta_client_ip_address")

    // meta_consent queda en "false" (registra que hubo revocación).
    expect(merged.find((a) => a.key === "meta_consent")?.value).toBe("false")

    // UTMs se preservan — no son PII.
    expect(merged.find((a) => a.key === "utm_source")?.value).toBe("meta")
    expect(merged.find((a) => a.key === "utm_campaign")?.value).toBe("octubre-plc")
  })

  test("meta_consent=true no borra nada", () => {
    const existing = [
      attr("meta_fbp", "fb.1.111.aaa"),
      attr("utm_source", "meta"),
    ]
    const incoming = [attr("meta_consent", "true")]
    const merged = mergeCartAttrs(existing, incoming)
    expect(merged.map((a) => a.key).sort()).toEqual(
      ["meta_consent", "meta_fbp", "utm_source"].sort(),
    )
  })

  test("meta_consent ausente en incoming no revoca (el estado persiste)", () => {
    const existing = [attr("meta_fbp", "fb.1.111.aaa"), attr("meta_consent", "true")]
    const incoming = [attr("utm_content", "M1-03")]
    const merged = mergeCartAttrs(existing, incoming)
    expect(merged.find((a) => a.key === "meta_fbp")?.value).toBe("fb.1.111.aaa")
  })
})
