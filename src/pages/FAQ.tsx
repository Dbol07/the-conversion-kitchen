import React from "react";
import Accordion from "../components/Accordion";
import FloralDivider from "../components/FloralDivider";
import BgFaq from "../assets/backgrounds/bg-faq.jpg";

export default function FAQ() {
  const faqs = [
    {
      title: "How do I convert cups to grams?",
      icon: "teacup",
      content:
        "The conversion depends on the ingredient. Flour: ~125g per cup. Sugar: 200g. Butter: 227g. Use our calculator for accurate results!",
    },
    {
      title: "What's the difference between fluid ounces and weight ounces?",
      icon: "leaf",
      content:
        "Fluid ounces measure volume, while weight ounces measure mass. They differ and cannot be used interchangeably in recipes.",
    },
    {
      title: "Can I use this app offline?",
      icon: "mushroom",
      content:
        "Yes! This PWA works offline once loaded. You can also install it to your device from the Install Prompt.",
    },
    {
      title: "How accurate are the conversions?",
      icon: "teacup",
      content:
        "Our calculator uses standard culinary conversions. They're perfect for cooking and baking.",
    },
    {
      title: "How do I print the conversion charts?",
      icon: "leaf",
      content:
        "Visit the Printables page, tap Download on any chart, then print from your device.",
    },

    // ⭐ NEW FAQ QUESTIONS ⭐
    {
      title: "How do I scale a recipe for more or fewer servings?",
      icon: "mushroom",
      content:
        "Use the Recipe Scaler in the Calculator page! Enter your original servings and new servings to instantly scale ingredient quantities.",
    },
    {
      title: "Why don’t cup-to-gram conversions match package labels?",
      icon: "leaf",
      content:
        "Ingredients vary in density. For example, flour can weigh 110g–130g per cup depending on how it’s scooped. Our calculator uses standard culinary averages.",
    },
    {
      title: "How can I convert a US recipe into metric?",
      icon: "teacup",
      content:
        "Use our Volume and Weight conversion categories. Cups → ml, ounces → grams, and Fahrenheit → Celsius.",
    },
    {
      title: "What’s the best way to measure flour?",
      icon: "leaf",
      content:
        "Spoon flour into a measuring cup and level it. Scooping compacts it and adds extra weight, affecting baking accuracy.",
    },
    {
      title: "Can I substitute butter for oil?",
      icon: "mushroom",
      content:
        "Generally yes! Use a 1:1 ratio, but baked goods may be denser. Melt the butter first for best texture.",
    },
    {
      title: "What is a PWA and how do I install it?",
      icon: "teacup",
      content:
        "A PWA is a web app that works offline and can be installed like an app. When prompted, choose 'Add to Home Screen'.",
    },
  ];

  return (
    <div
      className="min-h-screen pb-28 page-transition page-bg"
      style={{ backgroundImage: `url(${BgFaq})` }}
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
              <Accordion key={idx} title={faq.title} icon={faq.icon} defaultOpen={idx === 0}>
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
              Explore the Conversion Guide or use the Calculator for precise conversions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
