import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getBooks = async (req, res) => {
  const allBooks = await prisma.book.findMany({
    include: {
      author: true,
    },
  });
  res.json(allBooks);
};

export const getBookById = async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        author: true,
      },
    });

    if (!book) {
      return res.status(404).json('Book not found!');
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addBook = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'secretkey', async (err, decodedToken) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json('Token is not valid!');
    }

    try {
      const newBook = await prisma.book.create({
        data: {
          name: req.body.name,
          rating: req.body.rating,
          text: req.body.text,
          group: 'book',
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

      return res.status(200).json(newBook);
    } catch (error) {
      console.error('Error creating book:', error);
      return res.status(500).json(error);
    }
  });
};
