import React from 'react';
import { Phone } from 'lucide-react';

export default function FloatingContact() {
  const phoneNumber = "+971506969712";
  const rawNumber = "971506969712"; // For WhatsApp wa.me link

  return (
    <div className="fixed bottom-8 right-6 z-[9999] flex flex-col gap-3">
      
      {/* Botim Button */}
      <div className="tooltip tooltip-left tooltip-info" data-tip="Call on Botim">
        <a
          href={`botim://call?number=${phoneNumber}`}
          // Removed background/borders to let the SVG fill the whole space
          className="btn btn-circle btn-lg bg-transparent hover:bg-transparent border-none shadow-2xl hover:scale-110 transition-all duration-300 p-0 overflow-hidden"
          aria-label="Botim Call"
        >
          {/* Scaled to 100% (w-full h-full) */}
          <img src="/botim-icon-colored.svg" alt="Botim" className="w-full h-full object-cover" />
        </a>
      </div>

      {/* WhatsApp Button */}
      <div className="tooltip tooltip-left tooltip-success" data-tip="Chat on WhatsApp">
        <a
          href={`https://wa.me/${rawNumber}?text=Hi,%20I'm%20interested%20in%20your%20properties.`}
          target="_blank"
          rel="noopener noreferrer"
          // Removed background/borders to let the SVG fill the whole space
          className="btn btn-circle btn-lg bg-transparent hover:bg-transparent border-none shadow-2xl hover:scale-110 transition-all duration-300 p-0 overflow-hidden"
          aria-label="WhatsApp Chat"
        >
          {/* Scaled to 100% (w-full h-full) */}
          <img src="/whatsapp-icon-colored.svg" alt="WhatsApp" className="w-full h-full object-cover" />
        </a>
      </div>

      {/* Direct Phone Call Button (Kept as is because Lucide icons are transparent paths) */}
      <div className="tooltip tooltip-left" data-tip="Direct Call">
        <a
          href={`tel:${phoneNumber}`}
          className="btn btn-circle btn-lg bg-[#BFA15F] hover:bg-[#A88B4E] border-none text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          aria-label="Direct Phone Call"
        >
          <Phone size={26} fill="currentColor" />
        </a>
      </div>
      
    </div>
  );
}