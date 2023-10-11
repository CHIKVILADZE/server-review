import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const addReview = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', async (err, user) => {
    if (err) return res.status(403).json('Token is not valid!');

    try {
      const newReview = await prisma.review.create({
        data: {
          name: req.body.name,
          rating: req.body.rating,
          group: 'movie',
          author: {
            connect: {
              id: user.id,
            },
          },
          post: {
            connect: {
              id: req.body.postId,
            },
          },
        },
      });

      return res.status(200).json('Review has been created.');
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        postId: req.query.postId,
      },

      select: {
        id: true,
        name: true,
        rating: true,
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
