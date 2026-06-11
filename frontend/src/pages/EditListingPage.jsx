import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingStore } from '../store/listingStore';
import { X, Save, Upload, Trash2 } from 'lucide-react';

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
                    price: listing.price || '',
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
    }, [id]);

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
            submitData.append(key, formData[key]);
        });

        // Append existing image URLs we want to keep
        existingImages.forEach(imgUrl => {
            submitData.append('existingImages', imgUrl);
        });

        // Append new binary files
        newImages.forEach(file => {
            submitData.append('images', file);
        });

        try {
            await updateListing(id, submitData);
            navigate(`/admin`); // Send back to admin dashboard
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Edit Property</h1>
                    <p className="text-gray-600">Update listing details and photos</p>
                </div>
            </div>

            {error && <div className="alert alert-error mb-6"><span>{error}</span></div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Col: Details */}
                <div className="md:col-span-2 card bg-base-100 shadow-xl border border-gray-100">
                    <div className="card-body space-y-4">
                        {/* ... Keep all your existing text/number inputs here ... */}
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

                        {/* Display Existing Images */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {existingImages.map((imgUrl, idx) => (
                                <div key={`exist-${idx}`} className="relative group rounded-lg overflow-hidden border border-gray-200 h-24">
                                    <img src={imgUrl} alt="existing" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Display New Previews */}
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
                    <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
                        <X size={18} /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}