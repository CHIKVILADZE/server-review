import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getGames = async (req, res) => {
  const allGames = await prisma.game.findMany({
    include: {
      author: true,
    },
  });
  res.json(allGames);
};

export const getGameById = async (req, res) => {
  const gameId = req.params.id;

  try {
    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        author: true,
      },
    });

    if (!game) {
      return res.status(404).json('Game not found!');
    }

    res.json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addGame = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Token is not valid!');

  jwt.verify(token, 'secretkey', async (err, decodedToken) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json('Token is not valid!');
    }

    try {
      const newGame = await prisma.game.create({
        data: {
          name: req.body.name,
          rating: req.body.rating,
          text: req.body.text,
          group: 'game',
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

      return res.status(200).json(newGame);
    } catch (error) {
      console.error('Error creating game:', error);
      return res.status(500).json(error);
    }
  });
};
