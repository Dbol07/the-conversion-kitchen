import React from 'react';

const features = [
  {
    title: 'Instant Conversions',
    desc: 'Convert cups to grams, ounces to milliliters, and more in a single tap.',
    img: 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764434011745_32eba5a2.webp'
  },
  {
    title: 'Printable Charts',
    desc: 'Download beautiful parchment-style conversion charts for your kitchen.',
    img: 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764434012698_89dc936d.webp'
  },
  {
    title: 'User-Friendly Interface',
    desc: 'Clean, intuitive design that makes cooking stress-free and enjoyable.',
    img: 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764434013551_54067548.webp'
  }
];

export default function LandingFeatures() {
  return (
    <section className="py-20 px-4 bg-[#f5f1ed]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3c6150] mb-4">
          Why Home Chefs Love The Conversion Kitchen
        </h2>
        <div className="w-24 h-1 bg-[#a77a72] mx-auto mb-12 rounded-full" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="parchment-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-[#b8d3d5]/30 p-2">
                <img src={f.img} alt={f.title} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-[#5f3c43] mb-2">{f.title}</h3>
              <p className="text-[#1b302c]/80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
