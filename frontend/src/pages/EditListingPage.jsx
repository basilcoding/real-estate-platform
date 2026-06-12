import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingStore } from '../store/listingStore';
import { X, Save, Upload, Trash2, Home, MapPin, Building, DollarSign, FileText } from 'lucide-react';

export default function EditListingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { updateListing, getListing, isLoading, error } = useListingStore();

    const [formData, setFormData] = useState({
        title: '', description: '', price: '', isNegotiable: false,
        propertyType: 'House', status: 'Available', address: ''
    });

    // State for images
    const [existingImages, setExistingImages] = useState([]); // URLs from DB
    const [newImages, setNewImages] = useState([]); // File objects selected by user
    const [previewImages, setPreviewImages] = useState([]); // Blob URLs for preview

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listing = await getListing(id);
                setFormData({
                    title: listing.title,
                    description: listing.description,
                    // FIX: Gracefully handle null price from the database
                    price: listing.price !== null ? listing.price : '', 
                    isNegotiable: listing.isNegotiable || false,
                    propertyType: listing.propertyType,
                    status: listing.status,
                    address: listing.address,
                });
                setExistingImages(listing.images || []);
            } catch (err) {
                console.error('Failed to fetch listing');
            }
        };
        fetchListing();
    }, [id, getListing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle New Image Selection
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (indexToRemove) => {
        setExistingImages(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const removeNewImage = (indexToRemove) => {
        setNewImages(prev => prev.filter((_, i) => i !== indexToRemove));
        setPreviewImages(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 👇 We MUST use FormData when uploading files
        const submitData = new FormData();

        // Append standard fields
        Object.keys(formData).forEach(key => {
            // FIX: Do not append price if it is an empty string to prevent Mongoose validation errors
            if (key === 'price' && formData[key] === '') return;
            
            submitData.append(key, formData[key]);
        });

        // FIX: Explicitly send an empty string if all images were removed so the backend clears the array
        if (existingImages.length === 0) {
            submitData.append('existingImages', '');
        } else {
            // Append existing image URLs we want to keep
            existingImages.forEach(imgUrl => {
                submitData.append('existingImages', imgUrl);
            });
        }

        // Append new binary files
        newImages.forEach(file => {
            submitData.append('images', file);
        });

        try {
            await updateListing(id, submitData);
            navigate(`/admin`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#BFA15F] text-white shadow-md mb-3">
                        <Home className="w-7 h-7" strokeWidth={1.75} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Edit Property</h1>
                    <p className="text-gray-500 mt-1">Update listing details and manage property photos</p>
                </div>

                {error && (
                    <div className="mb-6 alert alert-error shadow-sm border-l-4 border-red-500 bg-red-50 text-red-700 rounded-lg">
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Two-column layout for form and images */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Main Details Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl border-2 border-[#BFA15F] shadow-md overflow-hidden">
                                <div className="p-6 space-y-5">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                                        <FileText size={20} className="text-[#BFA15F]" />
                                        Property Information
                                    </h2>

                                    <div className="form-control w-full text-black">
                                        <label className="label px-0.5 pb-1">
                                            <span className="label-text font-semibold text-gray-700">Title</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all rounded-lg"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-control w-full text-black">
                                        <label className="label px-0.5 pb-1">
                                            <span className="label-text font-semibold text-gray-700">Description</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            className="textarea textarea-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all rounded-lg"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                                        <div className="form-control w-full">
                                            <label className="label px-0.5 pb-1">
                                                <span className="label-text font-semibold text-gray-700 flex items-center gap-1">
                                                    <DollarSign size={16} className="text-[#BFA15F]" />
                                                    Price ($)
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                className="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all rounded-lg"
                                                value={formData.price}
                                                onChange={handleChange}
                                                disabled={formData.isNegotiable}
                                                required={!formData.isNegotiable}
                                            />
                                            <label className="label cursor-pointer justify-start gap-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    name="isNegotiable"
                                                    checked={formData.isNegotiable}
                                                    onChange={handleChange}
                                                    className="checkbox checkbox-sm rounded border-gray-300 checked:bg-[#BFA15F] checked:border-[#BFA15F] focus:ring-[#BFA15F]/20"
                                                />
                                                <span className="label-text">Price is Negotiable</span>
                                            </label>
                                        </div>

                                        <div className="form-control w-full text-black">
                                            <label className="label px-0.5 pb-1">
                                                <span className="label-text font-semibold text-gray-700 flex items-center gap-1">
                                                    <Building size={16} className="text-[#BFA15F]" />
                                                    Property Type
                                                </span>
                                            </label>
                                            <select
                                                name="propertyType"
                                                className="select select-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all rounded-lg"
                                                value={formData.propertyType}
                                                onChange={handleChange}
                                            >
                                                <option>House</option>
                                                <option>Apartment</option>
                                                <option>Commercial</option>
                                                <option>Land</option>
                                                <option>Villa</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-control w-full text-black">
                                        <label className="label px-0.5 pb-1">
                                            <span className="label-text font-semibold text-gray-700 flex items-center gap-1">
                                                <MapPin size={16} className="text-[#BFA15F]" />
                                                Address
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            className="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all rounded-lg"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-control w-full text-black">
                                        <label className="label px-0.5 pb-1">
                                            <span className="label-text font-semibold text-gray-700">Status</span>
                                        </label>
                                        <select
                                            name="status"
                                            className="select select-bordered w-full bg-white border-2 border-gray-200 focus:border-[#BFA15F] focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/20 transition-all rounded-lg"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option>Available</option>
                                            <option>Sold</option>
                                            <option>Rented</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Image Management Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border-2 border-[#BFA15F] shadow-md overflow-hidden sticky top-6">
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                                        <Upload size={18} className="text-[#BFA15F]" />
                                        Property Images
                                    </h3>

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#BFA15F] hover:text-[#BFA15F] transition-colors mb-5 bg-gray-50 hover:bg-white"
                                    >
                                        <Upload size={18} /> Add Photos
                                    </button>

                                    {/* Image List */}
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                        {existingImages.length === 0 && previewImages.length === 0 && (
                                            <div className="text-center text-gray-400 text-sm py-8 border border-dashed rounded-lg">
                                                No images added yet
                                            </div>
                                        )}

                                        {/* Existing Images */}
                                        {existingImages.map((imgUrl, idx) => (
                                            <div key={`exist-${idx}`} className="relative group rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-50 shadow-sm">
                                                <img src={imgUrl} alt="existing" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(idx)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                                                    aria-label="Remove existing image"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded">Existing</span>
                                            </div>
                                        ))}

                                        {/* New Previews */}
                                        {previewImages.map((previewUrl, idx) => (
                                            <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border-2 border-[#BFA15F]/30 h-24 bg-gray-50 shadow-sm">
                                                <span className="absolute top-1 left-1 bg-[#BFA15F] text-white text-[10px] px-1.5 rounded">New</span>
                                                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                                                    aria-label="Remove new image"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="btn btn-outline border-2 border-gray-300 text-gray-700 hover:border-[#BFA15F] hover:bg-[#BFA15F]/5 hover:text-[#BFA15F] rounded-lg gap-2"
                            onClick={() => navigate('/admin')}
                        >
                            <X size={18} /> GO BACK
                        </button>
                        <button
                            type="submit"
                            className="btn bg-[#BFA15F] hover:bg-[#A88B4E] text-white border-0 rounded-lg gap-2 shadow-md hover:shadow-lg transition-all px-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <Save size={18} />
                            )}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}