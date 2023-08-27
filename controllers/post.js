import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  const allPosts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  res.json(allPosts);
  console.log();
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', async (err, decodedToken) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json('Token is not valid!');
    }

    try {
      const newPost = await prisma.post.create({
        data: {
          title: req.body.title,
          author: { connect: { id: decodedToken.id } },
          desc: req.body.desc,
        },
      });

      return res.status(200).json('Post has been created.');
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};
