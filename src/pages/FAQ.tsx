import React from "react";
import { Link } from "react-router-dom";
import Accordion from "@/components/Accordion";
import FloralDivider from "@/components/FloralDivider";
import faqBanner from "@/assets/banners/faq-banner.png";

// ⭐ NEW — FAQ background image
import bgFaq from "@/assets/backgrounds/bg-faq.jpg";

export default function FAQ() {
  /* ---------------------- Categorized FAQs ---------------------- */

  const accordionStyle =
    "bg-gradient-to-r from-[#f7e6c4] via-[#f5d6b1] to-[#f2c9a0] border border-[#e4d5b8]";

  const calculatorFAQs = [
    {
      title: "How do I convert cups to grams?",
      icon: "teacup",
      content:
        "The conversion depends on the ingredient. For example, 1 cup of flour is about 120–125g, sugar is 200g, and butter is 227g. The calculator adjusts based on density for accuracy.",
    },
    {
      title: "Why does the calculator ask for an ingredient?",
      icon: "leaf",
      content:
        "Different ingredients have different densities. Selecting the ingredient ensures accurate conversions between cups, grams, milliliters, and ounces.",
    },
    {
      title: "Can I convert a full recipe at once?",
      icon: "mushroom",
      content:
        "Yes! Use the 'Full Recipe Converter' tab and paste your recipe text. The converter will extract quantities, scale servings, and switch between US and Metric.",
    },
  ];

  const measurementFAQs = [
    {
      title: "What's the difference between fluid ounces and weight ounces?",
      icon: "teacup",
      content:
        "Fluid ounces measure volume, while weight ounces measure mass. They are not interchangeable. Our calculator will choose the correct unit automatically.",
    },
    {
      title: "Why do results differ slightly between websites?",
      icon: "leaf",
      content:
        "Cooking conversions use average densities, and different websites choose slightly different reference values. Ours focuses on practical home-baking accuracy.",
    },
    {
      title: "How accurate are the conversions?",
      icon: "mushroom",
      content:
        "Values are based on widely accepted culinary references. For scientific precision, a digital scale is always the best option.",
    },
  ];

  const appUseFAQs = [
    {
      title: "Can I use this app offline?",
      icon: "mushroom",
      content:
        "Yes! This is a PWA (Progressive Web App). After your first visit, the app can work offline and can be installed on your device.",
    },
    {
      title: "How do I print the conversion charts?",
      icon: "leaf",
      content:
        "Go to the Printables page, choose a chart, and click Download PDF. You can print directly from your phone or computer.",
    },
    {
      title: "Do the printables cost anything?",
      icon: "teacup",
      content:
        "Nope! All printable conversion charts are free for personal use.",
    },
  ];

  const futureFAQs = [
    {
      title: "Will you add user accounts to save favorite recipes?",
      icon: "leaf",
      content:
        "Yes! A saved-recipes feature is planned for a future release and will integrate with Supabase authentication.",
    },
    {
      title: "Are more charts and guides coming?",
      icon: "mushroom",
      content:
        "Absolutely. Upcoming releases include spice guides, pan size conversion charts, and allergy-friendly substitutions.",
    },
    {
      title: "Will the app eventually include a meal planner?",
      icon: "teacup",
      content:
        "Yes! The long-term roadmap includes a companion Meal Planner PWA that will link directly with your saved recipes and conversions.",
    },
  ];

  return (
    <div className="pb-24">
      {/* ⭐ PAGE BANNER */}
      <div className="w-full h-40 sm:h-48 md:h-56 relative flex items-center justify-center mb-0 rounded-b-2xl overflow-hidden shadow">
        <img
          src={faqBanner}
          alt="FAQ Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1b302c]/35" />
        <h1 className="relative z-10 text-3xl sm:text-4xl font-bold text-white drop-shadow-lg text-center">
          Frequently Asked Questions
        </h1>
      </div>

      {/* ⭐ DIVIDER BEFORE BACKGROUND */}
      <FloralDivider variant="vine" size="md" className="mt-4" />

      {/* ⭐ BACKGROUND STARTS *BELOW* THE DIVIDER */}
      <div
        className="pt-8 pb-24"
        style={{
          backgroundImage: `url(${bgFaq})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="max-w-4xl mx-auto p-0">

          {/* ---------------------- CALCULATOR FAQ SECTION ---------------------- */}
          <section className="mt-4">
            <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
              🍵 Using the Calculator
            </h2>

            <div className="space-y-4">
              {calculatorFAQs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  title={faq.title}
                  icon={faq.icon}
                  className={accordionStyle}
                >
                  <p className="leading-relaxed">{faq.content}</p>
                </Accordion>
              ))}
            </div>
          </section>

          <FloralDivider variant="mushroom" className="my-8" />

          {/* ---------------------- MEASUREMENT FAQ SECTION ---------------------- */}
          <section>
            <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
              📏 Measurement & Conversion
            </h2>

            <div className="space-y-4">
              {measurementFAQs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  title={faq.title}
                  icon={faq.icon}
                  className={accordionStyle}
                >
                  <p className="leading-relaxed">{faq.content}</p>
                </Accordion>
              ))}
            </div>
          </section>

          <FloralDivider variant="vine" className="my-8" />

          {/* ---------------------- APP USAGE FAQ SECTION ---------------------- */}
          <section>
            <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
              📱 About the App
            </h2>

            <div className="space-y-4">
              {appUseFAQs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  title={faq.title}
                  icon={faq.icon}
                  className={accordionStyle}
                >
                  <p className="leading-relaxed">{faq.content}</p>
                </Accordion>
              ))}
            </div>
          </section>

          <FloralDivider variant="mushroom" className="my-8" />

          {/* ---------------------- FUTURE FEATURES FAQ SECTION ---------------------- */}
          <section>
            <h2 className="text-2xl font-bold text-[#4b3b2f] mb-3 flex items-center gap-2">
              🌟 Future Features & Updates
            </h2>

            <div className="space-y-4">
              {futureFAQs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  title={faq.title}
                  icon={faq.icon}
                  className={accordionStyle}
                >
                  <p className="leading-relaxed">{faq.content}</p>
                </Accordion>
              ))}
            </div>
          </section>

          {/* ---------------------- BOTTOM CARD WITH LINKS ---------------------- */}
          <div className="parchment-card p-6 text-center mt-12 rounded-2xl shadow-md bg-[#fffaf4]/95 border border-[#e4d5b8]">
            <h2 className="text-xl font-bold text-[#1b302c] mb-3">
              Still have questions?
            </h2>
            <p className="text-[#5f3c43]">
              Explore the{" "}
              <Link to="/guide" className="font-semibold underline text-emerald-700 hover:text-emerald-900">
                Kitchen Conversions Guide
              </Link>{" "}
              for more details, or open the{" "}
              <Link to="/calculator" className="font-semibold underline text-emerald-700 hover:text-emerald-900">
                Calculator
              </Link>{" "}
              for instant help.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
