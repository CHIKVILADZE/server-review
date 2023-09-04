import express from 'express';
import { getPosts, getPostById, addPost } from '../controllers/post.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', addPost);

export default router;
