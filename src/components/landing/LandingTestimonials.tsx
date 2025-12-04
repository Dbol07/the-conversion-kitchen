import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    text: "Finally, I don't have to Google measurements while cooking — love this app!",
    name: 'Sarah M.',
    img: 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764434000070_e6c62b16.webp'
  },
  {
    text: 'A must-have for any home baker. Super easy and accurate.',
    name: 'James L.',
    img: 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764434001938_b0a34e54.webp'
  },
  {
    text: 'The printable charts are gorgeous! I have them all over my kitchen.',
    name: 'Emily R.',
    img: 'https://d64gsuwffb70l.cloudfront.net/692a371e7b30c795e803582e_1764434003857_7c9f7e12.webp'
  }
];

export default function LandingTestimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  const t = testimonials[idx];

  return (
    <section className="py-20 px-4 bg-[#b8d3d5]/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#3c6150] mb-4">What Users Are Saying</h2>
        <p className="text-[#5f3c43] mb-8">Trusted by 100+ home chefs worldwide</p>
        
        <div className="relative parchment-card p-8 md:p-12">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-[#a77a72] fill-current" />)}
          </div>
          <p className="text-xl md:text-2xl text-[#1b302c] italic mb-6">"{t.text}"</p>
          <div className="flex items-center justify-center gap-3">
            <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#a77a72]" />
            <span className="font-semibold text-[#5f3c43]">{t.name}</span>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={prev} className="p-2 rounded-full bg-[#3c6150] text-white hover:bg-[#2d4a3d]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="p-2 rounded-full bg-[#3c6150] text-white hover:bg-[#2d4a3d]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
