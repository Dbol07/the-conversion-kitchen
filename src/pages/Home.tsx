import React from 'react';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingTestimonials from '../components/landing/LandingTestimonials';
import LandingHowItWorks from '../components/landing/LandingHowItWorks';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingCTA from '../components/landing/LandingCTA';
import LandingFooter from '../components/landing/LandingFooter';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const handleTryOnline = () => onNavigate('calculator');

  return (
    <div className="min-h-screen pb-20">
      <LandingHero onTryOnline={handleTryOnline} />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingHowItWorks />
      <LandingFAQ />
      <LandingCTA onTryOnline={handleTryOnline} />
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
