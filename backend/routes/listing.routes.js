import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
// Note: You may need to bypass validation for FormData, or update your schema to allow stringified booleans/numbers
import { validate } from '../middlewares/validate.middleware.js';
import { createListingSchema } from '../schemas/listing.schema.js';
import { upload } from '../middlewares/upload.middleware.js'; // 👈 Import upload
import { getListings, createListing, updateListing, deleteListing, getListing } from '../controllers/listing.controller.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListing);

// 👇 Apply upload.array('images', 10) to allow up to 10 images
router.post('/', protect, upload.array('images', 10), createListing);
router.put('/:id', protect, upload.array('images', 10), updateListing);
router.delete('/:id', protect, deleteListing);

export default router;