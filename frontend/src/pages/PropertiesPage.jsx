import React, { useEffect, useState } from 'react';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import { Heart, Star, ChevronRight, ChevronLeft, CheckCircle, X, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

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

    // Modal Controls
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

    // Handle Keyboard Navigation & prevent background scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';

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
                <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-[320px] md:h-[220px] rounded-xl overflow-hidden shrink-0 bg-gray-100 group">
                    <img
                        src={images[currentImageIndex]}
                        alt={`${listing.title} - view ${currentImageIndex + 1}`}
                        onClick={() => openModal(currentImageIndex)}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    />

                    {/* Slider Controls */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 md:p-1 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-1 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
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
                            {listing.views} {listing.views === 1 ? 'person' : 'people'} already viewed
                        </div>
                    )}
                </div>

                {/* Right: Content Section */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h2
                            onClick={() => navigate(`/listing/${listing._id}`)}
                            className="text-[1.15rem] font-bold text-gray-900 leading-tight cursor-pointer hover:text-[#0066FF] transition-colors"
                        >
                            {listing.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                            {listing.propertyType} in {listing.address}
                        </p>

                        {/* Responsive Highlights Grid */}
                        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-4 md:gap-8 mt-5 pb-5 border-b border-gray-100">
                            <div className="col-span-2 md:col-span-1">
                                <div className="text-xl font-bold text-gray-900">
                                    {listing.price ? `AED ${listing.price.toLocaleString()}` : (listing.isNegotiable ? 'Contact for Price' : 'Price N/A')}
                                </div>
                                {listing.price && <div className="text-xs text-gray-500 mt-0.5">Base Price</div>}
                            </div>

                            <div className="md:px-4 md:border-l md:border-gray-200">
                                <div className="text-[15px] font-bold text-gray-900">{listing.propertyType}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Property Type</div>
                            </div>

                            <div className="md:px-4 md:border-l md:border-gray-200">
                                <div className="text-[15px] font-bold text-gray-900 capitalize">{listing.status}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Current Status</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base whitespace-pre-line break-words line-clamp-2 md:line-clamp-3">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mt-6 gap-4">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Listed</span> · {getTimeAgo(listing.createdAt)}
                        </div>

                        {/* Responsive Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
                            {isAuthenticated && (
                                <button
                                    onClick={() => navigate(`/edit-listing/${listing._id}`)}
                                    className="w-full sm:w-auto justify-center px-4 py-2 flex items-center gap-1.5 rounded-lg border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/listing/${listing._id}`)}
                                className="w-full sm:w-auto justify-center px-6 py-2 rounded-lg border border-[#0066FF] text-[#0066FF] font-semibold text-sm hover:bg-blue-50 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN LIGHTBOX MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="absolute inset-0 z-0" onClick={closeModal}></div>
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 z-[101] transition-colors"
                    >
                        <X size={36} />
                    </button>

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

                    <div className="relative z-[10] flex flex-col items-center max-w-[90vw] max-h-[90vh]">
                        <img
                            src={images[modalIndex]}
                            alt={`Fullscreen ${modalIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-md select-none shadow-2xl"
                        />
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
    const [sortOption, setSortOption] = useState('latest');

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    const sortedListings = [...listings].sort((a, b) => {
        if (sortOption === 'price-asc') {
            const priceA = a.price !== null ? a.price : Infinity;
            const priceB = b.price !== null ? b.price : Infinity;
            return priceA - priceB;
        } else if (sortOption === 'price-desc') {
            const priceA = a.price !== null ? a.price : -Infinity;
            const priceB = b.price !== null ? b.price : -Infinity;
            return priceB - priceA;
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
            <div className="max-w-5xl mx-auto p-4 md:p-8">

                {/* Responsive Header & Sort */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <h1 className="text-xl md:text-2xl text-[#002B49] font-medium">
                        <span className="font-bold">{listings.length} results</span> | {listings.length > 0 ? listings[0].propertyType : 'Properties'}s available
                    </h1>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto justify-between md:justify-start">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Sort:</span>
                        <select
                            className="select select-sm select-ghost bg-white border-none text-gray-800 font-medium focus:outline-none focus:bg-transparent p-0 pr-6 w-full md:w-auto"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="latest">Latest Listed </option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {isLoading && (
                    <div className="text-center py-10 flex flex-col items-center gap-3">
                        <span className="loading loading-spinner text-[#0066FF] loading-lg"></span>
                        <p className="text-gray-500">Loading properties...</p>
                    </div>
                )}

                {error && <div className="text-red-500 py-4 text-center bg-red-50 rounded-xl">{error}</div>}

                <div className="space-y-4">
                    {sortedListings.map((listing) => (
                        <PropertyCard key={listing._id} listing={listing} />
                    ))}

                    {sortedListings.length === 0 && !isLoading && !error && (
                        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm px-4">
                            No properties available right now.
                        </div>
                    )}
                </div>

            </div>

            {/* Responsive Feedback Button (Text hides on very small screens) */}
            <a
                href="mailto:basilshahul234@gmail.com?subject=Feedback%20on%20Real%20Estate%20Platform"
                className="fixed right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-l-md border border-gray-200 p-2 md:p-3 cursor-pointer hover:bg-gray-50 flex flex-col items-center gap-1 z-50 transition-all"
            >
                <CheckCircle size={18} className="text-gray-600" />
                <span className="text-[10px] text-gray-600 font-medium hidden sm:block">Feedback</span>
            </a>

            <Footer />
        </div>
    );
}