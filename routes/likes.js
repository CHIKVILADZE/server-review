import express from 'express';
import {
  getLikes,
  getLikeById,
  addLike,
  deleteLike,
} from '../controllers/like.js';

const router = express.Router();

router.get('/', getLikes);
router.get('/:id', getLikeById);
router.post('/', addLike);
router.delete('/:id', deleteLike);

export default router;
