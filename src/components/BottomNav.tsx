import React from 'react';

interface NavProps {
  active: string;
  onNavigate: (page: string) => void;
}

const NAV_ICONS = {
  home: 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/icons/nav/nav-home.png',
  guide: 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/icons/nav/nav-guide.png',
  calculator: 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/icons/nav/nav-calculator.png',
  printables: 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/icons/nav/nav-printables.png',
  faq: 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/icons/nav/nav-faq.png',
  about: 'https://raw.githubusercontent.com/Dbol07/kitchen-conversion-app/main/assets/icons/nav/nav-about.png',
};

export default function BottomNav({ active, onNavigate }: NavProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'guide', label: 'Guide' },
    { id: 'calculator', label: 'Calc' },
    { id: 'printables', label: 'Print' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[#faf6f0] border-t-2 border-[#a77a72] shadow-[0_-4px_20px_rgba(95,60,67,0.15)] rounded-t-3xl mx-2 mb-0">
        <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 ${
                active === id 
                  ? 'scale-110 bg-[#b8d3d5]/30' 
                  : 'hover:bg-[#b8d3d5]/20'
              }`}
            >
              <img 
                src={NAV_ICONS[id as keyof typeof NAV_ICONS]} 
                alt={label}
                className={`w-6 h-6 transition-all ${active === id ? 'opacity-100' : 'opacity-70'}`}
              />
              <span className={`text-xs font-medium ${active === id ? 'text-[#3c6150]' : 'text-[#5f3c43]'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
