import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import {
  ArrowLeft,
  Trash2,
  Edit,
  Download,
  Map,
  MapPin,
  FileText,
  Layout,
  X,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Footer from "../components/Footer"

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null); // Changed to track index instead of URL
  const { getListing, deleteListing, isLoading } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        setListing(data);
      } catch (error) {
        console.error('Failed to fetch listing');
      }
    };
    fetchListing();
  }, [id, getListing]);

  const handleDelete = async () => {
    if (window.confirm('Delete this exquisite property?')) {
      try {
        await deleteListing(id);
        navigate('/');
      } catch (error) {
        console.error('Delete failed');
      }
    }
  };

  // Keyboard navigation for the image modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null || !listing?.images) return;

      if (e.key === 'Escape') setSelectedIndex(null);

      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
      }

      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, listing]);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  if (isLoading || !listing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111]">
        <span className="loading loading-spinner loading-lg text-[#C5A47E]"></span>
      </div>
    );
  }

  const hasImages = listing.images && listing.images.length > 0;
  const heroImage = hasImages ? listing.images[0] : '/placeholder-property.jpg';

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-sans selection:bg-[#C5A47E] selection:text-white pb-0">
      {/* Top Admin/Back Navigation */}
      <div className="absolute top-16 left-0 w-full z-50 p-4 flex justify-between items-center bg-gradient-to-b text-white">


        {isAuthenticated && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/edit-listing/${id}`)}
              className="flex items-center gap-2 hover:text-[#C5A47E] transition-colors uppercase tracking-widest text-xs font-semibold"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest text-xs font-semibold"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <div className="relative w-full h-[85vh] flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 pt-32 text-center text-white px-4">
          <h2 className="text-4xl md:text-6xl font-serif tracking-wide drop-shadow-md">
            Crafted for <br className="md:hidden" />
            <span className="font-semibold">a Like-minded Community.</span>
          </h2>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-8 text-white">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold uppercase tracking-wider mb-2">
              {listing.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-light tracking-wide">
              {listing.propertyType} Residences
            </p>
          </div>

          <div className="text-left md:text-right flex flex-col md:items-end">
            <p className="text-lg font-medium mb-3 tracking-wide">
              {listing.isNegotiable
                ? "Contact for Price*"
                : `Starting From $${listing.price.toLocaleString()}*`}
            </p>
            <a
              href={`https://wa.me/971506969712?text=${encodeURIComponent(`Hi, I'm interested in the property: ${listing.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#C5A47E] hover:bg-[#b5946e] text-black text-sm font-semibold uppercase tracking-[0.2em] px-8 py-4 transition-colors rounded-none text-center"
            >
              Enquire Now Through Whatsapp
            </a>
          </div>
        </div>
      </div>

      {/* PROJECT OVERVIEW & LOCATION SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl md:text-3xl text-gray-800 uppercase tracking-[0.15em] font-light mb-4">
          Project Overview
        </h2>

        <div className="flex items-center justify-center gap-2 text-[#C5A47E] mb-8 uppercase tracking-widest text-sm font-semibold">
          <MapPin size={16} />
          {listing.address}
        </div>

        <p className="text-gray-600 leading-relaxed font-light text-lg mb-16 whitespace-pre-line break-words">
          {listing.description}
        </p>

      </div>

      {/* GALLERY SECTION */}
      {hasImages && (
        <div className="py-20 bg-gray-50/50">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl text-gray-800 uppercase tracking-[0.15em] font-light mb-6">
              Gallery
            </h2>
            <div className="flex items-center justify-center text-sm tracking-widest font-semibold">
              <span className="text-black border-b-2 border-[#C5A47E] pb-1">PHOTOS</span>
            </div>
          </div>

          <div className="relative max-w-[100vw] overflow-hidden group">
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 px-6 md:px-12 pb-8">
              {listing.images.map((img, index) => (
                <div key={index} className="min-w-[85vw] md:min-w-[600px] snap-center flex-shrink-0">
                  <div
                    className="aspect-[4/3] w-full overflow-hidden bg-gray-200 cursor-zoom-in relative"
                    onClick={() => setSelectedIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`Gallery view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    {/* Hover overlay instructing user to click */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm tracking-widest backdrop-blur-sm">CLICK TO EXPAND</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER SECTION */}
      <Footer />

      {/* FULLSCREEN IMAGE ZOOM MODAL WITH NAVIGATION */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white flex items-center gap-2 tracking-widest text-sm uppercase transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            Close <X size={24} />
          </button>

          {/* Left Arrow (Only show if multiple images) */}
          {listing.images.length > 1 && (
            <button
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors z-50 p-2 hidden md:block"
              onClick={handlePrevImage}
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
          )}

          {/* Active Image */}
          <img
            src={listing.images[selectedIndex]}
            alt={`Zoomed property view ${selectedIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Right Arrow (Only show if multiple images) */}
          {listing.images.length > 1 && (
            <button
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors z-50 p-2 hidden md:block"
              onClick={handleNextImage}
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>
          )}

          {/* Mobile Navigation Area (Tap left/right side of image on touchscreens) */}
          <div className="absolute inset-y-0 left-0 w-1/4 z-40 md:hidden" onClick={handlePrevImage}></div>
          <div className="absolute inset-y-0 right-0 w-1/4 z-40 md:hidden" onClick={handleNextImage}></div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 tracking-widest text-sm font-medium">
            {selectedIndex + 1} / {listing.images.length}
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}