import { Phone } from "lucide-react";

export default function Footer() {
    return (

        <footer className="bg-black w-full text-white pt-12 pb-8 px-6 flex flex-col items-center">

            <div className="w-full max-w-7xl border-t border-gray-800 mb-8"></div>
            <div className="text-gray-300 text-lg md:text-base font-light tracking-wide mb-4 text-center">
                Easy Homes Contact
            </div>
            <div className="flex items-center gap-2 mb-6 text-sm md:text-base font-light tracking-wider hover:text-[#C5A47E] transition-colors cursor-pointer">
                <Phone size={18} />
                <span>+971 50 696 9712</span>
            </div>
            <div className="flex items-center gap-2 mb-6 text-sm md:text-base font-light tracking-wider hover:text-[#C5A47E] transition-colors cursor-pointer">
                <Phone size={18} />
                <span>+91 980 951 6305</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <a href="#" className="bg-white flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-gray-300 hover:scale-110 transition-all">
                    <img src="/Facebook-1--Streamline-Plump.svg" alt="Facebook" className="w-[20px] h-[20px] object-contain" />
                </a>
                <a href="#" className="bg-white flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-gray-300 hover:scale-110 transition-all">
                    <img src="/youtube-123.svg" alt="YouTube" className="w-[20px] h-[20px] object-contain" />
                </a>
                <a href="#" className="bg-white flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-gray-300 hover:scale-110 transition-all">
                    <img src="/Twitter-X--Streamline-Bootstrap.svg" alt="X (Twitter)" className="w-[18px] h-[18px] object-contain" />
                </a>
                <a href="#" className="bg-white flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-gray-300 hover:scale-110 transition-all">
                    <img src="/instagram.svg" alt="Instagram" className="w-[20px] h-[20px] object-contain" />
                </a>
            </div>

            <div className="w-full max-w-7xl border-t border-gray-800 mb-6"></div>

            <div className="text-gray-400 text-xs md:text-sm tracking-wide font-light text-center">
                Easy Homes Limited © Copyright 2026 All rights reserved
            </div>
        </footer>
    );
}