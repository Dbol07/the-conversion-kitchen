import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Wifi, Scale } from 'lucide-react';

const faqs = [
  { q: 'Is the app free?', a: 'Yes! All conversions are completely free to use.', icon: HelpCircle },
  { q: 'Can I use it offline?', a: 'Yes, favorites and saved conversions work offline.', icon: Wifi },
  { q: 'Which units are supported?', a: 'Cups, grams, ounces, tablespoons, teaspoons, milliliters, and more!', icon: Scale }
];

export default function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-[#b8d3d5]/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3c6150] mb-4">
          Frequently Asked Questions
        </h2>
        <div className="w-24 h-1 bg-[#a77a72] mx-auto mb-12 rounded-full" />
        
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="parchment-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-[#b8d3d5]/20 transition-colors"
              >
                <f.icon className="w-6 h-6 text-[#3c6150] flex-shrink-0" />
                <span className="flex-1 font-semibold text-[#5f3c43]">{f.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#a77a72] transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 pl-14 text-[#1b302c]/80 animate-fade-in">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
