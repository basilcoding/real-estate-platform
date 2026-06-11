import { useEffect } from 'react';
import { useListingStore } from '../store/listingStore';
import { useNavigate } from 'react-router-dom';
import { Edit2, Plus, Trash2 } from 'lucide-react';

export default function AdminPropertiesPage() {
    const { listings, fetchListings, deleteListing, isLoading } = useListingStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    if (isLoading) return <div className="text-center py-20">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage all property listings</p>
                </div>
                {/* 👇 FIXED: matches App.jsx route */}
                <button onClick={() => navigate('/create-listing')} className="btn btn-primary gap-2">
                    <Plus size={18} /> Add New Property
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Title & Address</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {listings.map(listing => (
                            <tr key={listing._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                        {listing.images?.length > 0 ? (
                                            <img src={listing.images[0]} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">No Img</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-semibold text-gray-900">{listing.title}</div>
                                    <div className="text-xs text-gray-500">{listing.address}</div>
                                </td>
                                <td className="p-4 font-medium text-gray-800">
                                    {listing.isNegotiable ? 'Negotiable' : `$${listing.price?.toLocaleString()}`}
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                                        {listing.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {/* 👇 FIXED: matches App.jsx route */}
                                    <button onClick={() => navigate(`/edit-listing/${listing._id}`)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteListing(listing._id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}