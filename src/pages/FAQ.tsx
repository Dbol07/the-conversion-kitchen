import React from 'react';
import Accordion from '../components/Accordion';
import FloralDivider from '../components/FloralDivider';

export default function FAQ() {
  const faqs = [
    {
      title: 'How do I convert cups to grams?',
      icon: 'teacup' as const,
      content: 'The conversion depends on the ingredient. For flour, 1 cup is about 120-125g. For sugar, 1 cup is 200g. For butter, 1 cup is 227g. Use our calculator for precise conversions!'
    },
    {
      title: "What's the difference between fluid ounces and weight ounces?",
      icon: 'leaf' as const,
      content: "Fluid ounces measure volume (like cups and tablespoons), while weight ounces measure mass. They're different measurements and shouldn't be confused in recipes."
    },
    {
      title: 'Can I use this app offline?',
      icon: 'mushroom' as const,
      content: "Yes! This is a Progressive Web App (PWA). Once you've visited it, it will work offline. You can also install it to your home screen for quick access."
    },
    {
      title: 'How accurate are the conversions?',
      icon: 'teacup' as const,
      content: 'Our conversions use standard culinary measurements and are accurate for cooking and baking. For scientific precision, consult specialized tools.'
    },
    {
      title: 'How do I print the conversion charts?',
      icon: 'leaf' as const,
      content: "Visit the Printables page, click 'Download' on any chart to save it, then print from your device."
    }
  ];

  return (
    <div 
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: 'url(https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/backgrounds/bg-faq.jpg)' }}
    >
      <div className="bg-[#1b302c]/30 min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Frequently Asked Questions</h1>
            <p className="text-white/90 mt-2">Common kitchen measurement questions</p>
          </div>

          <FloralDivider variant="mushroom" />

          <div className="mt-8 space-y-4">
            {faqs.map((faq, idx) => (
              <Accordion key={idx} title={faq.title} icon={faq.icon} defaultOpen={idx === 0}>
                <p className="leading-relaxed">{faq.content}</p>
              </Accordion>
            ))}
          </div>

          <FloralDivider variant="vine" />

          <div className="parchment-card p-6 text-center mt-8">
            <h2 className="text-xl font-bold text-[#1b302c] mb-3">Still have questions?</h2>
            <p className="text-[#5f3c43]">
              Check out our Conversion Guide for detailed reference charts, or use the Calculator for instant conversions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
