import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { getListing, deleteListing, isLoading } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        setListing(data);
      } catch (error) {
        console.error('Failed to fetch listing');
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Delete this listing?')) {
      try {
        await deleteListing(id);
        navigate('/');
      } catch (error) {
        console.error('Delete failed');
      }
    }
  };

  if (isLoading || !listing) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="btn btn-ghost gap-2 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="text-4xl font-bold">{listing.title}</h1>
              <p className="text-gray-600">{listing.address}</p>
              <p className="text-gray-700 mt-4">{listing.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="text-4xl font-bold text-success">
                {listing.isNegotiable ? (
                  <span className="text-2xl">Contact for Price</span>
                ) : (
                  `$${listing.price.toLocaleString()}`
                )}
              </div>
              <div className="divider my-2"></div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{listing.propertyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="badge badge-outline">{listing.status}</span>
                </div>
              </div>

              {isAuthenticated && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/edit-listing/${id}`)}
                    className="btn btn-sm btn-primary flex-1 gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-sm btn-error gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}