import { useState } from "react";
import FloralDivider from "@/components/FloralDivider";

const FAQ_ITEMS = [
  {
    q: "Where do your conversion formulas come from?",
    a: "All volume-to-weight conversions are based on standard ingredient density averages for home baking."
  },
  {
    q: "Why does the calculator give slightly different results from other sites?",
    a: "Different kitchens use different density charts. We aim for consistency and clarity over complicated tables."
  },
  {
    q: "Can I convert full recipes at once?",
    a: "Yes! Use the Full Recipe tab in the Calculator to paste entire ingredient lists."
  },
  {
    q: "Are the printables free?",
    a: "Absolutely! All printable charts are free for personal use."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-6 pb-24">
      <h1 className="text-3xl font-bold text-center text-[#4b3b2f] mb-2">
        Frequently Asked Questions
      </h1>

      <FloralDivider variant="vine" size="md" />

      <div className="mt-6 space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/90 border border-[#e4d5b8] rounded-xl shadow p-4"
          >
            <button
              className="w-full text-left text-lg font-semibold text-[#4b3b2f]"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              {item.q}
            </button>

            {open === idx && (
              <p className="mt-3 text-[#5f3c43] leading-relaxed">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
