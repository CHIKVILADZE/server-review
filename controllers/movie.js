import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getMovies = async (req, res) => {
  const allMovies = await prisma.movie.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.json(allMovies);
};

export const getMovieById = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
      include: {
        author: true,
      },
    });

    if (!movie) {
      return res.status(404).json('movie not found!');
    }

    res.json(movie);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addMovie = async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const newMovie = await prisma.movie.create({
      data: {
        name: req.body.name,
        rating: String(req.body.rating),
        text: req.body.text,
        group: 'movie',
        author: {
          connect: {
            id: req.body.userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            googleId: req.body.googleId,
            githubId: req.body.githubId,
          },
        },
        post: {
          connect: {
            id: req.body.postId,
          },
        },
      },
      include: {
        author: true,
      },
    });

    return res.status(200).json(newMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    return res.status(500).json(error);
  }
};
