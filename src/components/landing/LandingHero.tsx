import React from 'react';

interface LandingHeroProps {
  onTryOnline: () => void;
}

const heroImg = 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764433998148_d98ab95a.webp';
const phoneImg = 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764433999134_1c5f17e2.webp';

export default function LandingHero({ onTryOnline }: LandingHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImg} alt="Cozy kitchen" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b302c]/80 via-[#1b302c]/60 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Convert Recipes in Seconds — <span className="text-[#b8d3d5]">No More Guesswork!</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Easily switch between cups, grams, ounces, and more with our simple, free kitchen conversion app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="cottagecore-btn bg-[#3c6150] text-white hover:bg-[#2d4a3d] text-lg px-8 py-4">
              Download the App
            </button>
            <button onClick={onTryOnline} className="cottagecore-btn bg-white/90 text-[#3c6150] hover:bg-white text-lg px-8 py-4">
              Try it Online
            </button>
          </div>
        </div>
        
        <div className="hidden md:flex justify-center">
          <img src={phoneImg} alt="App preview" className="w-64 lg:w-80 drop-shadow-2xl animate-bounce-soft rounded-3xl" />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5f1ed] to-transparent" />
    </section>
  );
}
