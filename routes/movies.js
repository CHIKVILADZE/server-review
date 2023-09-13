import express from 'express';
import { getMovies, getMovieById, addMovie } from '../controllers/movie.js';
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

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', upload.single('image'), addMovie);

export default router;
