import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingStore } from '../store/listingStore';
import { X, Save } from 'lucide-react';

export default function EditListingPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        isNegotiable: false, // 👈 Add this
        propertyType: 'House',
        status: 'Available',
        address: '',
    });
    const { updateListing, getListing, isLoading, error } = useListingStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listing = await getListing(id);
                setFormData({
                    title: listing.title,
                    description: listing.description,
                    price: listing.price || '', // Handle missing price gracefully
                    isNegotiable: listing.isNegotiable || false, // 👈 Add this
                    propertyType: listing.propertyType,
                    status: listing.status,
                    address: listing.address,
                });
            } catch (err) {
                console.error('Failed to fetch listing');
            }
        };
        fetchListing();
    }, [id]);

    // 👇 Update handleChange to support checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : (name === 'price' ? (value ? Number(value) : '') : value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateListing(id, formData);
            navigate(`/listing/${id}`);
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Edit Listing</h1>
                <p className="text-gray-600">Update property details</p>
            </div>

            {error && (
                <div className="alert alert-error mb-6">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
                <div className="card-body space-y-5">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Title</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="input input-bordered input-md"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Description</span>
                        </label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered textarea-md"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Price ($)</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                className="input input-bordered input-md"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={isLoading || formData.isNegotiable} // 👈 Disable if negotiable
                                required={!formData.isNegotiable}             // 👈 Only required if not negotiable
                            />

                            {/* 👇 Add the checkbox right under the price input */}
                            <label className="label cursor-pointer justify-start gap-2 mt-1">
                                <input
                                    type="checkbox"
                                    name="isNegotiable"
                                    checked={formData.isNegotiable}
                                    onChange={handleChange}
                                    className="checkbox checkbox-sm checkbox-primary"
                                />
                                <span className="label-text">Price is Negotiable</span>
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Property Type</span>
                            </label>
                            <select
                                name="propertyType"
                                className="select select-bordered select-md"
                                value={formData.propertyType}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <option>House</option>
                                <option>Apartment</option>
                                <option>Commercial</option>
                                <option>Land</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Address</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            className="input input-bordered input-md"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Status</span>
                        </label>
                        <select
                            name="status"
                            className="select select-bordered select-md"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option>Available</option>
                            <option>Sold</option>
                            <option>Rented</option>
                        </select>
                    </div>

                    <div className="card-actions gap-2 pt-4 border-t justify-end">
                        <button
                            type="button"
                            className="btn btn-outline gap-2"
                            onClick={() => navigate(`/listing/${id}`)}
                            disabled={isLoading}
                        >
                            <X size={18} />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}