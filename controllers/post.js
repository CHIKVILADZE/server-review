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
};

export const getPostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      return res.status(404).json('Post not found!');
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addPost = async (req, res) => {
  jwt.verify(token, 'secretkey', async (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: err.message });
    } else {
      try {
        const newPost = await prisma.post.create({
          data: {
            title: req.body.title,
            authorId: user.id,
            desc: req.body.desc,
            group: req.body.group,
            reviewName: req.body.reviewName,
            image: req.file.filename,

            author: {
              connect: {
                id: req.body.userId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                googleId: req.body.googleId,
                githubId: req.body.githubId,
              },
            },
          },
        });
        console.log('newPost', newPost);
        return res
          .status(200)
          .json({ message: 'Post has been created successfully.' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
  });
};

export const getTopRatedPosts = async (req, res) => {
  try {
    const topRatedPosts = await prisma.post.findMany({
      orderBy: {
        sumRating: 'desc',
      },
      take: 8,
    });

    res.json(topRatedPosts);
  } catch (error) {
    console.error('Error fetching top-rated posts:', error);
    res.status(500).json(error);
  }
};

export const updatePost = async (req, res) => {
  const { sumRating } = req.body;
  const postId = req.params.id;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { sumRating: sumRating },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post sumRating:', error);
    res.status(500).json(error);
  }
};
