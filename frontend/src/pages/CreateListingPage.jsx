import { useState } from 'react';
import { useListingStore } from '../store/listingStore';
import { useNavigate } from 'react-router-dom';
import { X, Save } from 'lucide-react';

export default function CreateListingPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        isNegotiable: false, // 👈 Add to state
        propertyType: 'House',
        status: 'Available',
        address: '',
    });
    const { createListing, isLoading, error } = useListingStore();
    const navigate = useNavigate();

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
            await createListing(formData);
            navigate('/');
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Create New Listing</h1>
                <p className="text-gray-600">Add a new property to your listings</p>
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
                            placeholder="Beautiful Modern House"
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
                            placeholder="Describe the property in detail..."
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
                                placeholder="0"
                                className="input input-bordered input-md"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={isLoading || formData.isNegotiable} // 👈 Disable if negotiable is checked
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
                            placeholder="123 Main Street, City, State"
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
                            onClick={() => navigate('/')}
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Create Listing
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}