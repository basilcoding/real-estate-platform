import { useEffect } from 'react';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import { Plus, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { listings, isLoading, error, fetchListings, deleteListing } = useListingStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Property Listings</h1>
          <p className="text-gray-600 mt-1">Find your perfect property</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => navigate('/create-listing')}
            className="btn btn-primary gap-2"
          >
            <Plus size={20} />
            New Listing
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : listings.length === 0 ? (
        <div className="alert alert-info">
          <span>No listings available yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title text-lg">{listing.title}</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{listing.address}</span>
                  </div>

                  <p className="text-gray-700 line-clamp-2">{listing.description}</p>

                  <div className="flex gap-2 pt-2">
                    <span className="badge badge-primary">{listing.propertyType}</span>
                    <span className="badge badge-outline">{listing.status}</span>
                  </div>
                </div>

                <div className="card-actions justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-1 text-success font-bold text-lg">
                    {listing.isNegotiable ? (
                      <span>Contact for Price</span>
                    ) : (
                      <>
                        <DollarSign size={20} />
                        {listing.price.toLocaleString()}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/listing/${listing._id}`)}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </button>
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => navigate(`/edit-listing/${listing._id}`)}
                          className="btn btn-sm btn-info"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this listing?')) {
                              deleteListing(listing._id);
                            }
                          }}
                          className="btn btn-sm btn-error"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}