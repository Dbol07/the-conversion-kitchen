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
      'It depends on the ingredient: Flour ≈ 120–125g per cup, Sugar ≈ 200g per cup, Butter ≈ 227g per cup. For precise results, use the Calculator.'
  },
  {
    title: "What's the difference between fluid ounces and weight ounces?",
    icon: 'leaf' as const,
    content:
      'Fluid ounces measure liquid volume, while weight ounces measure mass. They are not interchangeable.'
  },
  {
    title: 'Can I use this app offline?',
    icon: 'mushroom' as const,
    content:
      'Yes! After your first visit, the PWA will cache essential pages so you can use it without internet.'
  },
  {
    title: 'How accurate are the conversions?',
    icon: 'teacup' as const,
    content:
      'Our conversions use accepted culinary standards and are great for everyday cooking and baking.'
  },
  {
    title: 'How do I print the conversion charts?',
    icon: 'leaf' as const,
    content:
      'Go to Printables → tap Download → open the file → print. All charts are high-resolution and ready to use.'
  },
  {
    title: 'Why do different flour brands weigh differently?',
    icon: 'mushroom' as const,
    content:
      'Humidity, milling style, and storage all affect flour density. Spoon-and-level is the most consistent method.'
  },
  {
    title: 'What’s the easiest way to halve a recipe with 1 egg?',
    icon: 'leaf' as const,
    content:
      'Beat the egg and use half — about 1.5 tablespoons.'
  },
  {
    title: 'Can I substitute baking soda for baking powder?',
    icon: 'teacup' as const,
    content:
      'Sometimes! But you must add an acid (lemon juice or vinegar) to activate the baking soda.'
  },
  // NEW ONES:
  {
    title: 'Why did my cake turn out dense?',
    icon: 'mushroom' as const,
    content:
      'Common causes: overmixing, expired leaveners, or incorrect flour measurement. Spoon-and-level flour for best results.'
  },
  {
    title: 'Should I weigh ingredients instead of using cups?',
    icon: 'leaf' as const,
    content:
      'Yes — weighing ingredients is more accurate, especially for baking. Even small differences matter in delicate recipes.'
  },
  {
    title: 'How accurate is my oven temperature?',
    icon: 'teacup' as const,
    content:
      'Most home ovens can be off by 10–40°F. An oven thermometer helps ensure consistent baking results.'
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
