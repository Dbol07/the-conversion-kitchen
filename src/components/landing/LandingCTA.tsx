import React from 'react';

interface LandingCTAProps {
  onTryOnline: () => void;
}

export default function LandingCTA({ onTryOnline }: LandingCTAProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[#3c6150] to-[#2d4a3d]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Make Kitchen Conversions Easy?
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Join thousands of home cooks who've simplified their cooking experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="cottagecore-btn bg-white text-[#3c6150] hover:bg-[#f5f1ed] text-lg px-10 py-4">
            Download Now
          </button>
          <button onClick={onTryOnline} className="cottagecore-btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4">
            Try it Online
          </button>
        </div>
      </div>
    </section>
  );
}
