import React from 'react';
import FloralDivider from '../components/FloralDivider';
import DecorativeFrame from '../components/DecorativeFrame';

const BASE_URL = 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/printables';

export default function Printables() {
  const printables = [
    { title: 'Volume Conversions 1', image: `${BASE_URL}/conversions-volume1.jpg`, desc: 'Basic volume reference' },
    { title: 'Volume Conversions 2', image: `${BASE_URL}/conversions-volume2.jpg`, desc: 'Extended volume chart' },
    { title: 'Volume Conversions 3', image: `${BASE_URL}/conversions-volume3.jpg`, desc: 'Metric conversions' },
    { title: 'Volume Conversions 4', image: `${BASE_URL}/conversions-volume4.jpg`, desc: 'Baking measurements' },
    { title: 'Volume Conversions 5', image: `${BASE_URL}/conversions-volume5.jpg`, desc: 'Quick reference card' },
  ];

  return (
    <div 
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: 'url(https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/backgrounds/bg-printables.jpg)' }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Printable Charts</h1>
            <p className="text-white/90 mt-2">Download and print for your kitchen</p>
          </div>

          <FloralDivider variant="mushroom" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {printables.map((item, idx) => (
              <DecorativeFrame key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="parchment-card overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 bg-[#faf6f0]">
                    <h3 className="text-lg font-bold text-[#1b302c] mb-1">{item.title}</h3>
                    <p className="text-[#5f3c43] text-sm mb-3">{item.desc}</p>
                    <div className="flex gap-2">
                      <a href={item.image} target="_blank" rel="noopener noreferrer" className="flex-1 cottagecore-btn bg-[#3c6150] text-white text-center text-sm hover:bg-[#5f3c43]">View</a>
                      <a href={item.image} download className="flex-1 cottagecore-btn bg-[#a77a72] text-white text-center text-sm hover:bg-[#5f3c43]">Download</a>
                    </div>
                  </div>
                </div>
              </DecorativeFrame>
            ))}
          </div>

          <FloralDivider variant="vine" />
        </div>
      </div>
    </div>
  );
}
