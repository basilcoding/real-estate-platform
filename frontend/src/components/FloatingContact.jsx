import React from 'react';
import { Phone } from 'lucide-react';

export default function FloatingContact() {
  const contacts = [
    { label: "Villa Line 1", phone: "+971506969712", raw: "971506969712" },
    { label: "Villa Line 2", phone: "+919809516305", raw: "9809516305" }
  ];

  return (
    <div className="fixed bottom-8 right-6 z-[9999] flex flex-col gap-3">
      
      {/* Botim Dropdown */}
      {/* dropdown-left and dropdown-end ensure the menu opens to the left and expands upwards, keeping it on screen */}
      <div className="dropdown dropdown-left dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-circle btn-lg bg-transparent hover:bg-transparent border-none shadow-2xl hover:scale-110 transition-all duration-300 p-0 overflow-hidden"
          aria-label="Botim Call"
        >
          <img src="/botim-icon-colored.svg" alt="Botim" className="w-full h-full object-cover" />
        </div>
        
        {/* Botim Menu (Blue theme) */}
        <ul tabIndex={0} className="dropdown-content z-[1] menu menu-xs bg-[#0082FF] text-white rounded-box w-56 shadow-2xl mr-3 mb-1 p-2">
          <li className="menu-title text-blue-100 font-semibold pb-2">Botim Call</li>
          {contacts.map((contact, index) => (
            <li key={`botim-${index}`}>
              <a 
                href={`botim://call?number=${contact.phone}`} 
                className="hover:bg-white/20 flex flex-col items-start py-2"
              >
                <span className="text-sm font-medium">{contact.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* WhatsApp Dropdown */}
      <div className="dropdown dropdown-left dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-circle btn-lg bg-transparent hover:bg-transparent border-none shadow-2xl hover:scale-110 transition-all duration-300 p-0 overflow-hidden"
          aria-label="WhatsApp Chat"
        >
          <img src="/whatsapp-icon-colored.svg" alt="WhatsApp" className="w-full h-full object-cover" />
        </div>
        
        {/* WhatsApp Menu (Green theme) */}
        <ul tabIndex={0} className="dropdown-content z-[1] menu menu-xs bg-[#25D366] text-white rounded-box w-56 shadow-2xl mr-3 mb-1 p-2">
          <li className="menu-title text-green-100 font-semibold pb-2">WhatsApp Chat</li>
          {contacts.map((contact, index) => (
            <li key={`wa-${index}`}>
              <a 
                href={`https://wa.me/${contact.raw}?text=Hi,%20I'm%20interested%20in%20your%20villa%20rentals.`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:bg-white/20 flex flex-col items-start py-2"
              >
                <span className="text-sm font-medium">{contact.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Direct Phone Call Dropdown */}
      <div className="dropdown dropdown-left dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-circle btn-lg bg-[#BFA15F] hover:bg-[#A88B4E] border-none text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          aria-label="Direct Phone Call"
        >
          <Phone size={26} fill="currentColor" />
        </div>

        {/* Direct Call Menu (Gold theme matching your UI) */}
        <ul tabIndex={0} className="dropdown-content z-[1] menu menu-xs bg-[#BFA15F] text-white rounded-box w-56 shadow-2xl mr-3 mb-1 p-2">
          <li className="menu-title text-yellow-50 font-semibold pb-2">Direct Call</li>
          {contacts.map((contact, index) => (
            <li key={`phone-${index}`}>
              <a 
                href={`tel:${contact.phone}`} 
                className="hover:bg-white/20 flex flex-col items-start py-2"
              >
                <span className="text-sm font-medium">{contact.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}