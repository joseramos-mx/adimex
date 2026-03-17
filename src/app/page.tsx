import { Header } from "@/components/ui/header-04";
import { Hero } from "@/components/hero";
import LogoMarquee from "@/components/logo-marquee";
import Articles from "@/components/articles";
import Catalog from "@/components/catalog";
import Testimonial from "@/components/testimonial";
import CTA from "@/components/cta";
import Footer from "@/components/footer";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1">
      <Header />
      <Hero />
      <LogoMarquee/>
      <Articles/>
      <Catalog/>
      <Testimonial />
      <CTA />
      </main>
      <Footer />
    </div>
  );
}
