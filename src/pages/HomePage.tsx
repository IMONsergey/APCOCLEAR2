import '../styles/home-layout.css';
import {
  SearchableSection,
  HomeUseCases,
  SecurityTeamsCTA,
} from '../components/sections/HomeProductSections';
import { Hero } from '../components/sections/Hero';
import { SearchPreview } from '../components/sections/SearchPreview';
import { StepCarousel } from '../components/sections/StepCarousel';
import { DataSection } from '../components/sections/DataSection';
import { ApiSection } from '../components/sections/ApiSection';
import { PricingSection } from '../components/sections/PricingSection';
import { FAQSection } from '../components/sections/FAQSection';
import { ClosingSection } from '../components/sections/ClosingSection';
import { Visual } from '../components/visuals/Visual';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchPreview />
      <SearchableSection />
      <StepCarousel />
      <HomeUseCases />
      <DataSection />
      <ApiSection />
      <PricingSection showTeamBanner={false} />
      <SecurityTeamsCTA />
      <div className="lower-scene">
        <Visual kind="waves" />
        <FAQSection />
        <ClosingSection />
      </div>
    </>
  );
}
