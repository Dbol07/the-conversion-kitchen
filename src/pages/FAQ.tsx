import React from 'react';
import Accordion from '../components/Accordion';
import FloralDivider from '../components/FloralDivider';

import BgFAQ from '../assets/backgrounds/bg-faq.jpg';

export default function FAQ() {
  const faqs = [
    {
      title: 'How do I convert cups to grams?',
      icon: 'teacup' as const,
      content:
        'The conversion depends on the ingredient. Flour: 120–125g per cup. Sugar: 200g per cup. Butter: 227g per cup. Use our calculator for precise conversions!'
    },
    {
      title: "What's the difference between fluid ounces and weight ounces?",
      icon: 'leaf' as const,
      content:
        "Fluid ounces measure volume, while weight ounces measure mass. They’re not interchangeable."
    },
    {
      title: 'Can I use this app offline?',
      icon: 'mushroom' as const,
      content:
        'Yes! This PWA works offline after your first visit. You can also install it to your home screen.'
    },
    {
      title: 'How accurate are the conversions?',
      icon: 'teacup' as const,
      content:
        'Our conversions follow standard culinary references. They are ideal for home cooking and baking.'
    },
    {
      title: 'How do I print the conversion charts?',
      icon: 'leaf' as const,
      content:
        "Go to the Printables page, tap any chart’s Download button, and print the saved file."
    },

    // NEW FAQ ENTRIES
    {
      title: 'Why do different flour brands weigh differently?',
      icon: 'mushroom' as const,
      content:
        'Flour compacts differently depending on humidity and brand. Always spoon-and-level for the most consistent results.'
    },
    {
      title: 'What’s the easiest way to halve a recipe with 1 egg?',
      icon: 'leaf' as const,
      content:
        'Beat the egg, measure it, and use half (about 1.5 tablespoons).'
    },
    {
      title: 'Is it okay to substitute baking soda for baking powder?',
      icon: 'teacup' as const,
      content:
        'Sometimes! But you also need acid (like lemon or vinegar) for baking soda to activate.'
    }
  ];

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgFAQ})` }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-white/90 mt-2">
              Common kitchen measurement questions
            </p>
          </div>

          <FloralDivider variant="mushroom" />

          <div className="mt-8 space-y-4">
            {faqs.map((faq, idx) => (
              <Accordion key={idx} title={faq.title} icon={faq.icon}>
                <p className="leading-relaxed">{faq.content}</p>
              </Accordion>
            ))}
          </div>

          <FloralDivider variant="vine" />

          <div className="parchment-card p-6 text-center mt-8">
            <h2 className="text-xl font-bold text-[#1b302c] mb-3">
              Still have questions?
            </h2>
            <p className="text-[#5f3c43]">
              Explore our Conversions Guide or try the Calculator for instant results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
