import React from 'react';
import FloralDivider from '../components/FloralDivider';
import DecorativeFrame from '../components/DecorativeFrame';

export default function About() {
  return (
    <div 
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: 'url(https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/backgrounds/bg-about.png)' }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">About Us</h1>
          </div>

          <FloralDivider variant="mushroom" />

          <DecorativeFrame className="mt-8">
            <div className="parchment-card p-8">
              <p className="text-[#1b302c] text-lg leading-relaxed mb-6">
                Welcome to <strong className="text-[#3c6150]">The Conversion Kitchen</strong> — your cozy corner of the internet where warm cottage vibes meet practical kitchen magic.
              </p>

              <p className="text-[#1b302c] text-lg leading-relaxed mb-6">
                We created this app for home bakers, recipe lovers, and anyone who's ever wondered, "How many tablespoons are in a cup again?"
              </p>

              <p className="text-[#1b302c] text-lg leading-relaxed mb-6">
                Our mission is to make cooking comforting and stress-free through beautiful tools, printable helpers, and quick-reference guides.
              </p>

              <div className="bg-gradient-to-r from-[#b8d3d5] to-[#a77a72]/50 p-6 rounded-xl">
                <p className="text-[#1b302c] text-lg leading-relaxed text-center italic">
                  Thank you for being here — let's make something delicious together!
                </p>
              </div>
            </div>
          </DecorativeFrame>
        </div>
      </div>
    </div>
  );
}
