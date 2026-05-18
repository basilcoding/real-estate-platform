import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createListingSchema } from '../schemas/listing.schema.js';
import { 
  getListings, 
  createListing, 
  updateListing, 
  deleteListing, 
  getListing 
} from '../controllers/listing.controller.js';
 
const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListing);

// Protected routes
router.post('/', protect, validate(createListingSchema), createListing);
router.put('/:id', protect, validate(createListingSchema), updateListing);
router.delete('/:id', protect, deleteListing);

export default router;