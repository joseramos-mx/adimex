import { test, expect } from "@playwright/test"
import {
  normalizeCity,
  normalizeCountry,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeZip,
} from "../src/lib/meta-user-data"

/**
 * Casos mexicanos reales para la normalización de user_data que exige Meta
 * antes de hashear (round-5 p6). El objetivo es que estos tests fallen
 * ruidosamente si alguien cambia la lógica y rompe el matching con la app
 * de Meta en Shopify (que sigue la misma spec).
 */

test.describe("normalizePhone (México)", () => {
  test("10 dígitos: prefija 52", () => {
    expect(normalizePhone("5635698469")).toBe("525635698469")
  })

  test("10 dígitos con espacios y guiones", () => {
    expect(normalizePhone("55 3569 8469")).toBe("525535698469")
    expect(normalizePhone("(55) 3569-8469")).toBe("525535698469")
  })

  test("13 dígitos empezando en 521: pasa a 52+últimos 10 (legacy móvil)", () => {
    expect(normalizePhone("5215635698469")).toBe("525635698469")
  })

  test("12 dígitos con 52 al inicio: tal cual", () => {
    expect(normalizePhone("525635698469")).toBe("525635698469")
  })

  test("acepta '+' del formato E.164", () => {
    expect(normalizePhone("+525635698469")).toBe("525635698469")
    expect(normalizePhone("+52 55 3569 8469")).toBe("525535698469")
  })

  test("vacío/undefined/null → ''", () => {
    expect(normalizePhone(undefined)).toBe("")
    expect(normalizePhone(null)).toBe("")
    expect(normalizePhone("")).toBe("")
  })

  test("otro país (11d, no MX): pasa tal cual (asume ya trae CC)", () => {
    expect(normalizePhone("14155550100")).toBe("14155550100") // US
  })
})

test.describe("normalizeEmail", () => {
  test("trim + lowercase", () => {
    expect(normalizeEmail("  Ventas@ADIMEX.io ")).toBe("ventas@adimex.io")
  })
  test("vacío", () => {
    expect(normalizeEmail(undefined)).toBe("")
    expect(normalizeEmail(null)).toBe("")
    expect(normalizeEmail("")).toBe("")
  })
})

test.describe("normalizeName", () => {
  test("lowercase, quita puntuación, mantiene acentos", () => {
    expect(normalizeName("José Ramos")).toBe("josé ramos")
    expect(normalizeName("Muñoz-Álvarez")).toBe("muñoz-álvarez") // guion permitido
  })
  test("quita comas, puntos, apóstrofos", () => {
    expect(normalizeName("O'Neill, Jr.")).toBe("oneill jr")
  })
  test("colapsa espacios múltiples", () => {
    expect(normalizeName("Ana    María")).toBe("ana maría")
  })
})

test.describe("normalizeCity", () => {
  test("lowercase, sin espacios ni puntuación", () => {
    expect(normalizeCity("Ciudad de México")).toBe("ciudaddeméxico")
    expect(normalizeCity("San Luis Potosí")).toBe("sanluispotosí")
    expect(normalizeCity("Guadalajara, Jal.")).toBe("guadalajarajal")
  })
  test("vacío", () => {
    expect(normalizeCity(undefined)).toBe("")
  })
})

test.describe("normalizeZip", () => {
  test("5 dígitos MX", () => {
    expect(normalizeZip("06600")).toBe("06600")
    expect(normalizeZip("64000")).toBe("64000")
  })
  test("con espacios o guiones", () => {
    expect(normalizeZip("06600-1234")).toBe("06600")
  })
  test("acepta CPs con menos dígitos (los deja tal cual)", () => {
    expect(normalizeZip("650")).toBe("650")
  })
  test("vacío/undefined", () => {
    expect(normalizeZip(undefined)).toBe("")
  })
})

test.describe("normalizeCountry", () => {
  test("ISO-2 en minúsculas", () => {
    expect(normalizeCountry("MX")).toBe("mx")
    expect(normalizeCountry("us")).toBe("us")
  })
  test("no ISO-2 → ''", () => {
    expect(normalizeCountry("México")).toBe("")
    expect(normalizeCountry(undefined)).toBe("")
  })
})
