import Listing from '../models/Listing.js';

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch listings' });
  }
};

export const createListing = async (req, res) => {
  try {
    const { title, description, price, isNegotiable, propertyType, status, address } = req.body;
    // All listings belong to the company (no createdBy)
    const listing = await Listing.create({
      title,
      description,
      price,
      isNegotiable,      // 👇 Add to creation
      propertyType,
      status: status || 'Available',
      address,
    });

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Listing creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create listing'
    });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, isNegotiable, propertyType, status, address } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { title, description, price, propertyType, status, address },
      { returnDocument: 'after', runValidators: true } // ✅ Modern syntax
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update listing'
    });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete listing'
    });
  }
};

export const getListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch listing'
    });
  }
};