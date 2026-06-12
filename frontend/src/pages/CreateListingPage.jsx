import { useState, useRef } from 'react';
import { useListingStore } from '../store/listingStore';
import { useNavigate } from 'react-router-dom';
import { 
    X, 
    Save, 
    Upload, 
    Trash2, 
    Building, 
    FileText, 
    Tag, 
    Image as ImageIcon,
    MapPin,
    DollarSign
} from 'lucide-react';

export default function CreateListingPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { createListing, isLoading, error } = useListingStore();

    const [formData, setFormData] = useState({
        title: '', description: '', price: '', isNegotiable: false,
        propertyType: 'House', status: 'Available', address: ''
    });

    const [newImages, setNewImages] = useState([]); 
    const [previewImages, setPreviewImages] = useState([]); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const removeNewImage = (indexToRemove) => {
        setNewImages(prev => prev.filter((_, i) => i !== indexToRemove));
        setPreviewImages(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();

        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        newImages.forEach(file => {
            submitData.append('images', file);
        });

        try {
            await createListing(submitData);
            navigate('/admin'); 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="container mx-auto max-w-6xl">
                
                {/* Header Section */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#BFA15F] flex items-center justify-center shadow-lg">
                        <Building size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Add New Property</h1>
                        <p className="text-gray-500 mt-1 font-light tracking-wide">Enter the exquisite details and high-quality photos for the listing.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl flex items-center gap-3 shadow-sm">
                        <X className="text-red-500" size={20} />
                        <span className="text-red-700 font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Details & Classifications (Takes up 2/3 of the space) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Section 1: Basic Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 uppercase tracking-wider">
                                <FileText size={20} className="text-[#BFA15F]" /> Basic Information
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Property Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        placeholder="Property name"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/50 focus:border-[#BFA15F] transition-all" 
                                        value={formData.title} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea 
                                        name="description" 
                                        placeholder="Describe the elegant features of this property..."
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/50 focus:border-[#BFA15F] transition-all resize-none" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <MapPin size={14} /> Full Address
                                    </label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        placeholder="Address..."
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/50 focus:border-[#BFA15F] transition-all" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Pricing & Classification */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 uppercase tracking-wider">
                                <Tag size={20} className="text-[#BFA15F]" /> Pricing & Attributes
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Price Input Area */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                        <DollarSign size={14} /> Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            placeholder="0.00"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/50 focus:border-[#BFA15F] transition-all disabled:bg-gray-100 disabled:text-gray-400" 
                                            value={formData.price} 
                                            onChange={handleChange} 
                                            disabled={formData.isNegotiable} 
                                            required={!formData.isNegotiable} 
                                        />
                                    </div>
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            name="isNegotiable" 
                                            checked={formData.isNegotiable} 
                                            onChange={handleChange} 
                                            className="checkbox checkbox-sm rounded border-gray-300 checked:bg-[#BFA15F] checked:border-[#BFA15F] focus:ring-[#BFA15F]/20" 
                                        />
                                        <span className="text-sm font-semibold text-gray-700">Contact for Price / Negotiable</span>
                                    </label>
                                </div>

                                {/* Property Type & Status */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Property Type</label>
                                        <select 
                                            name="propertyType" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/50 focus:border-[#BFA15F] transition-all appearance-none font-medium" 
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

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Listing Status</label>
                                        <select 
                                            name="status" 
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA15F]/50 focus:border-[#BFA15F] transition-all appearance-none font-medium" 
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
                    </div>

                    {/* Right Col: Image Upload & Actions (Takes up 1/3 of the space) */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 uppercase tracking-wider">
                                <ImageIcon size={20} className="text-[#BFA15F]" /> Media Gallery
                            </h2>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            {/* Dropzone/Upload Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#BFA15F] hover:bg-[#BFA15F]/5 hover:text-[#BFA15F] transition-all mb-6 group"
                            >
                                <div className="p-4 bg-gray-50 rounded-full group-hover:bg-white transition-colors">
                                    <Upload size={28} />
                                </div>
                                <div className="text-center">
                                    <span className="font-semibold block">Click to upload photos</span>
                                    <span className="text-xs font-light mt-1">PNG, JPG, up to 10MB</span>
                                </div>
                            </button>

                            {/* Display New Previews in a Grid */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {previewImages.map((previewUrl, idx) => (
                                        <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                                            <img src={previewUrl} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeNewImage(idx)} 
                                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transform scale-75 group-hover:scale-100 transition-all shadow-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {previewImages.length === 0 && (
                                <div className="text-center text-sm text-gray-400 font-light mt-4">
                                    No images selected yet.
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                <button 
                                    type="submit" 
                                    className="w-full py-4 bg-black hover:bg-gray-800 text-[#C5A47E] font-semibold tracking-widest uppercase rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
                                    {isLoading ? 'Processing...' : 'Publish Listing'}
                                </button>
                                <button 
                                    type="button" 
                                    className="w-full py-4 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2" 
                                    onClick={() => navigate('/admin')}
                                >
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
                /* Custom Scrollbar for the image preview area */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db; 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af; 
                }
            `}</style>
        </div>
    );
}