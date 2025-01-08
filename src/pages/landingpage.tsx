import React from 'react';
import { LandingHero } from '../components/landing/LandingHero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { QualityAssured } from '../components/landing/QualityAssured';
import { GetStarted } from '../components/landing/GetStarted';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingHero onGetStarted={onGetStarted} />
      <HowItWorks />
      <QualityAssured />
      <GetStarted onGetStarted={onGetStarted} />
    </div>
  );
}