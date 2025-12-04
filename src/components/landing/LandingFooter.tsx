import React from 'react';
import { Instagram, Music2, Image } from 'lucide-react';

interface LandingFooterProps {
  onNavigate: (page: string) => void;
}

export default function LandingFooter({ onNavigate }: LandingFooterProps) {
  return (
    <footer className="bg-[#1b302c] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#b8d3d5] mb-4">The Conversion Kitchen</h3>
            <p className="text-white/70">Making cooking simple, one conversion at a time.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#b8d3d5] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', page: 'about' },
                { label: 'FAQ', page: 'faq' },
                { label: 'Calculator', page: 'calculator' },
                { label: 'Printables', page: 'printables' }
              ].map((link) => (
                <li key={link.page}>
                  <button onClick={() => onNavigate(link.page)} className="text-white/70 hover:text-[#b8d3d5] transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#b8d3d5] mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#3c6150] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#3c6150] transition-colors">
                <Music2 className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#3c6150] transition-colors">
                <Image className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} The Conversion Kitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
