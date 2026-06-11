import { create } from 'zustand';
import api from '../api/axios';

export const useListingStore = create((set) => ({
  listings: [],
  isLoading: false,
  error: null,

  fetchListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/listings');
      set({ listings: data.listings });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch listings';
      set({ error: errorMsg });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update your createListing function in listingStore.js
  createListing: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      // 👇 Configure headers for multipart form data
      const { data } = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({ listings: [...state.listings, data.listing] }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create listing';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateListing: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      // 👇 Configure headers for multipart form data
      const { data } = await api.put(`/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({
        listings: state.listings.map(l => l._id === id ? data.listing : l)
      }));
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update listing';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/listings/${id}`);
      set((state) => ({
        listings: state.listings.filter(l => l._id !== id)
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete listing';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/listings/${id}`);
      return data.listing;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch listing';
      set({ error: errorMsg });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },


  clearError: () => set({ error: null }),
}));