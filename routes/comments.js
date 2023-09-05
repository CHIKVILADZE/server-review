import express from 'express';
import {
  getComments,
  addComment,
  deleteComment,
  getCommentById,
} from '../controllers/comment.js';

const router = express.Router();

router.get('/', getComments);
router.get('/:id', getCommentById);
router.post('/', addComment);
router.delete('/:id', deleteComment);

export default router;
