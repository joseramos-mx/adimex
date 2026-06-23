import { Header } from "@/components/ui/header-04";
import { Hero } from "@/components/hero";
import LogoMarquee from "@/components/logo-marquee";
import Articles from "@/components/articles";
import Catalog from "@/components/catalog";
import AvailableProducts from "@/components/available-products";
import MexicoMap from "@/components/mexico-map";
import Testimonial from "@/components/testimonial";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import { getProducts } from "@/lib/products";


export default async function Home() {
  const all = await getProducts({})
  const availableProducts = all.filter((p) => p.shopifyHandle && p.variantId)

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1">
      <Header />
      <Hero />
      <LogoMarquee/>
      <Articles/>
      <Catalog/>
      <AvailableProducts products={availableProducts} />
      <Testimonial />
      <MexicoMap />
      <CTA />
      </main>
      <Footer />
    </div>
  );
}
