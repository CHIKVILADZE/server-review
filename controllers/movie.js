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
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', async (err, decodedToken) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json('Token is not valid!');
    }

    try {
      const newMovie = await prisma.movie.create({
        data: {
          name: req.body.name,
          rating: req.body.rating,
          text: req.body.text,
          group: 'movie',
          author: {
            connect: {
              id: decodedToken.id,
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
  });
};
