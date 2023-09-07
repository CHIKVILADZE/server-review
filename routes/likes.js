import express from 'express';
import {
  getLikes,
  getLikeById,
  addLike,
  deleteLike,
} from '../controllers/like.js';

const router = express.Router();

router.get('/', getLikes);
router.get('/', getLikeById);
router.post('/', addLike);
router.delete('/', deleteLike);

export default router;
