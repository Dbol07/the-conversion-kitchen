import React from 'react';
import { Smartphone, ListFilter, FileText } from 'lucide-react';

const steps = [
  { icon: Smartphone, title: 'Open the App', desc: 'Launch The Conversion Kitchen on any device' },
  { icon: ListFilter, title: 'Select & Measure', desc: 'Choose your ingredient and measurement type' },
  { icon: FileText, title: 'Get Results', desc: 'Instant conversions plus printable charts' }
];

export default function LandingHowItWorks() {
  return (
    <section className="py-20 px-4 bg-[#f5f1ed]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3c6150] mb-4">
          Get Started in 3 Simple Steps
        </h2>
        <div className="w-24 h-1 bg-[#a77a72] mx-auto mb-12 rounded-full" />
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-[#b8d3d5]" />
          
          {steps.map((s, i) => (
            <div key={i} className="text-center relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#3c6150] flex items-center justify-center shadow-lg">
                <s.icon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#a77a72] text-white flex items-center justify-center font-bold text-sm">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold text-[#5f3c43] mb-2 mt-2">{s.title}</h3>
              <p className="text-[#1b302c]/80">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
