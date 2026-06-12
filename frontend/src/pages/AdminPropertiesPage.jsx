import { useEffect, useState } from 'react';
import { useListingStore } from '../store/listingStore';
import { useNavigate } from 'react-router-dom';
import { Edit2, Plus, Trash2, Home, Building, AlertCircle } from 'lucide-react';

export default function AdminPropertiesPage() {
    const { listings, fetchListings, deleteListing, isLoading } = useListingStore();
    const navigate = useNavigate();
    
    // State to handle the delete confirmation modal
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // Handle the actual deletion after confirmation
    const handleConfirmDelete = async () => {
        if (propertyToDelete) {
            try {
                await deleteListing(propertyToDelete);
            } catch (error) {
                console.error("Failed to delete property");
            } finally {
                setPropertyToDelete(null); // Close modal
            }
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg text-[#BFA15F]"></span>
                <p className="mt-3 text-gray-600">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-[#BFA15F] flex items-center justify-center">
                                <Building size={18} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        </div>
                        <p className="text-gray-500 ml-10">Manage all property listings</p>
                    </div>
                    <button
                        onClick={() => navigate('/create-listing')}
                        className="btn bg-[#BFA15F] hover:bg-[#A88B4E] text-white border-0 rounded-lg gap-2 shadow-md hover:shadow-lg transition-all px-5"
                    >
                        <Plus size={18} /> Add New Property
                    </button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl border-2 border-[#BFA15F] shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-[#BFA15F]/20 text-gray-700 text-sm">
                                <tr>
                                    <th className="p-4 font-semibold w-24">Image</th>
                                    <th className="p-4 font-semibold">Property Details</th>
                                    <th className="p-4 font-semibold">Price</th>
                                    <th className="p-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {listings.map(listing => (
                                    <tr key={listing._id} className="hover:bg-[#BFA15F]/5 transition-colors duration-150">
                                        <td className="p-4 align-top">
                                            <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                {listing.images?.length > 0 ? (
                                                    <img src={listing.images[0]} alt="preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Home size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="font-semibold text-gray-800 text-lg">{listing.title}</div>
                                            <div className="text-sm text-gray-500 mt-0.5">{listing.address}</div>
                                            
                                            {/* Actions moved below the title and address */}
                                            <div className="flex items-center gap-4 mt-3">
                                                <button
                                                    onClick={() => navigate(`/edit-listing/${listing._id}`)}
                                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#BFA15F] transition-colors"
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                <div className="w-px h-4 bg-gray-300"></div> {/* Separator Line */}
                                                <button
                                                    onClick={() => setPropertyToDelete(listing._id)}
                                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top font-medium text-gray-800 pt-5">
                                            {listing.isNegotiable ? (
                                                <span className="text-[#BFA15F]">Contact for Price</span>
                                            ) : (
                                                `$${listing.price?.toLocaleString()}`
                                            )}
                                        </td>
                                        <td className="p-4 align-top pt-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                listing.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                listing.status === 'Sold' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {listings.length === 0 && !isLoading && (
                        <div className="text-center py-16">
                            <Home size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No properties found. Click "Add New Property" to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {propertyToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h3>
                        <p className="text-gray-500 mb-8 px-2">
                            Do you really want to delete this property? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setPropertyToDelete(null)} 
                                className="btn flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none rounded-xl"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmDelete} 
                                className="btn flex-1 bg-red-500 hover:bg-red-600 text-white border-none rounded-xl"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}