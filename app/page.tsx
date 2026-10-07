import { CinematicHero } from "@/components/ui/cinematic-hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScanFlow } from "@/components/landing/scan-flow";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Hardware } from "@/components/landing/hardware";
import { Team } from "@/components/landing/team";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf6ee]">
      <SiteHeader />
      <main>
        <CinematicHero />
        <ScanFlow />
        <Features />
        <HowItWorks />
        <Hardware />
        <Team />
      </main>
      <SiteFooter />
    </div>
  );
}
