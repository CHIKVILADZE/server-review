import express from 'express';
import {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  getTopRatedPosts,
} from '../controllers/post.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/images';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '_' + Date.now() + ext);
  },
});

const upload = multer({ storage });

router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.post('/', upload.single('image'), addPost);

export default router;
