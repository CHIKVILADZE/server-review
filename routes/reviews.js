import express from 'express';
import { getAllReviews, addReview } from '../controllers/review.js';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', addReview);

export default router;
