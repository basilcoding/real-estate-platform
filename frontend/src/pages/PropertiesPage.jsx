import React, { useEffect, useState } from 'react';
import { useListingStore } from '../store/listingStore';
import { Heart, Star, ChevronRight, ChevronLeft, ChevronDown, CheckCircle, X } from 'lucide-react'; // 👈 Added 'X' icon

// Helper to format date relative to now
const getTimeAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
};

// Extracted Card Component
const PropertyCard = ({ listing }) => {
    // State for the small card slider
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 👇 State for the fullscreen Lightbox Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const images = listing.images && listing.images.length > 0
        ? listing.images
        : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"];

    // Card Slider Controls
    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // 👇 Modal Controls
    const openModal = (index) => {
        setModalIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const nextModalImage = (e) => {
        e?.stopPropagation();
        setModalIndex((prev) => (prev + 1) % images.length);
    };

    const prevModalImage = (e) => {
        e?.stopPropagation();
        setModalIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // 👇 Handle Keyboard Navigation & prevent background scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'; // Stop background scrolling

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowRight') nextModalImage();
                if (e.key === 'ArrowLeft') prevModalImage();
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isModalOpen, images.length]);

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5">

                {/* Left: Image Section with Slider */}
                <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-[320px] md:h-[220px] rounded-xl overflow-hidden shrink-0 bg-gray-100 group">                    <img
                    src={images[currentImageIndex]}
                    alt={`${listing.title} - view ${currentImageIndex + 1}`}
                    onClick={() => openModal(currentImageIndex)} // 👈 Open modal on click
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500" // Added cursor-pointer
                />

                    {/* Slider Controls */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={20} />
                            </button>

                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {listing.featured && (
                        <div className="absolute top-3 left-3 bg-[#1A1A40] text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase z-10 pointer-events-none">
                            Featured
                        </div>
                    )}

                    <button className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors z-10">
                        <Heart size={20} className="drop-shadow-md" />
                    </button>

                    {listing.views > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-2 px-3 text-white text-xs font-medium flex items-center gap-1.5 z-0 pointer-events-none">
                            <Star size={12} className="fill-white" />
                            {listing.views} {listing.views === 1 ? 'person' : 'people'} already viewed this week
                        </div>
                    )}
                </div>

                {/* Right: Content Section */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-[1.15rem] font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors">
                            {listing.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                            {listing.propertyType} in {listing.address}
                        </p>

                        {/* Highlights Grid */}
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-5 pb-5 border-b border-gray-100">
                            <div>
                                <div className="text-xl font-bold text-gray-900">
                                    {listing.price ? `₹${listing.price.toLocaleString()}` : (listing.isNegotiable ? 'Contact for Price' : 'Price N/A')}
                                </div>
                                {listing.price && <div className="text-xs text-gray-500 mt-0.5">Base Price</div>}
                            </div>

                            <div className="px-4 border-l border-gray-200">
                                <div className="text-[15px] font-bold text-gray-900">{listing.propertyType}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Property Type</div>
                            </div>

                            <div className="px-4 border-l border-gray-200">
                                <div className="text-[15px] font-bold text-gray-900 capitalize">{listing.status}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Current Status</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between mt-6 gap-4">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Listed</span> · {getTimeAgo(listing.createdAt)}
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-6 py-2 rounded-lg border border-[#0066FF] text-[#0066FF] font-semibold text-sm hover:bg-blue-50 transition-colors">
                                View Details
                            </button>
                            <button className="px-6 py-2 rounded-lg bg-[#0066FF] text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 👇 FULLSCREEN LIGHTBOX MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">

                    {/* Close Area (Clicking background closes modal) */}
                    <div className="absolute inset-0 z-0" onClick={closeModal}></div>

                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 z-[101] transition-colors"
                    >
                        <X size={36} />
                    </button>

                    {/* Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevModalImage}
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={nextModalImage}
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Main Image View */}
                    <div className="relative z-[10] flex flex-col items-center max-w-[90vw] max-h-[90vh]">
                        <img
                            src={images[modalIndex]}
                            alt={`Fullscreen ${modalIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-md select-none shadow-2xl"
                        />

                        {/* Image Counter */}
                        <div className="mt-6 text-white/80 font-medium text-sm tracking-widest bg-white/10 px-4 py-2 rounded-full">
                            {modalIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Main Page Component
export default function PropertiesPage() {
    const { listings, isLoading, error, fetchListings } = useListingStore();

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                <div className="mb-6">
                    <h1 className="text-xl md:text-2xl text-[#002B49] font-medium">
                        <span className="font-bold">{listings.length} results</span> | {listings.length > 0 ? listings[0].propertyType : 'Properties'}s available
                    </h1>
                </div>

                <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold whitespace-nowrap shrink-0">
                        <Star size={14} className="fill-orange-500 text-orange-500" />
                        <span className="italic">NEW LAUNCH</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 absolute -top-1 -right-1" />
                    </button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-sm whitespace-nowrap shrink-0 hover:bg-gray-50">Owner</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-sm whitespace-nowrap shrink-0 hover:bg-gray-50">Verified</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-sm whitespace-nowrap shrink-0 hover:bg-gray-50">Under construction</button>
                    <button className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-sm whitespace-nowrap shrink-0 hover:bg-gray-50">Ready To Move</button>

                    <div className="ml-auto flex items-center gap-2 shrink-0 pl-4 border-l border-gray-300">
                        <span className="text-sm font-medium text-gray-700">Sort By</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </div>
                </div>

                {isLoading && <div className="text-center py-10">Loading properties...</div>}
                {error && <div className="text-red-500 py-4">{error}</div>}

                <div className="space-y-4">
                    {listings.map((listing) => (
                        <PropertyCard key={listing._id} listing={listing} />
                    ))}

                    {listings.length === 0 && !isLoading && !error && (
                        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                            No properties match your current criteria.
                        </div>
                    )}
                </div>

            </div>

            <div className="fixed right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-l-md border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 flex flex-col items-center gap-1">
                <CheckCircle size={18} className="text-gray-600" />
                <span className="text-[10px] text-gray-600 font-medium">Feedback</span>
            </div>

        </div>
    );
}