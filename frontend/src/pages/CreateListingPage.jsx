import { useState, useRef } from 'react';
import { useListingStore } from '../store/listingStore';
import { useNavigate } from 'react-router-dom';
import { X, Save, Upload, Trash2 } from 'lucide-react';

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
            // 👇 FIXED: matches App.jsx route
            navigate('/admin'); 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Create New Property</h1>
                    <p className="text-gray-600">Add listing details and photos</p>
                </div>
            </div>

            {error && <div className="alert alert-error mb-6"><span>{error}</span></div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Col: Details */}
                <div className="md:col-span-2 card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body space-y-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Title</span></label>
                            <input type="text" name="title" className="input input-bordered" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Description</span></label>
                            <textarea name="description" className="textarea textarea-bordered" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Price ($)</span></label>
                                <input type="number" name="price" className="input input-bordered" value={formData.price} onChange={handleChange} disabled={formData.isNegotiable} required={!formData.isNegotiable} />
                                <label className="label cursor-pointer justify-start gap-2 mt-1">
                                    <input type="checkbox" name="isNegotiable" checked={formData.isNegotiable} onChange={handleChange} className="checkbox checkbox-sm checkbox-primary" />
                                    <span className="label-text">Price is Negotiable</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Property Type</span></label>
                                <select name="propertyType" className="select select-bordered" value={formData.propertyType} onChange={handleChange}>
                                    <option>House</option><option>Apartment</option><option>Commercial</option><option>Land</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Address</span></label>
                            <input type="text" name="address" className="input input-bordered" value={formData.address} onChange={handleChange} required />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Status</span></label>
                            <select name="status" className="select select-bordered" value={formData.status} onChange={handleChange}>
                                <option>Available</option><option>Sold</option><option>Rented</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Col: Image Upload Area */}
                <div className="card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body">
                        <h3 className="font-semibold text-lg mb-2">Property Images</h3>

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
                            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors mb-4"
                        >
                            <Upload size={20} /> Add Photos
                        </button>

                        {/* Display New Previews */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {previewImages.map((previewUrl, idx) => (
                                <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border-2 border-blue-200 h-24">
                                    <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 rounded">New</span>
                                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                    {/* 👇 FIXED: matches App.jsx route */}
                    <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
                        <X size={18} /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
                        {isLoading ? 'Creating...' : 'Create Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
}