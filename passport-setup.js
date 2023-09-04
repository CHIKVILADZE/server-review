import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile'],
    },

    async (accessToken, refreshToken, profile, done) => {
      const user = await prisma.user.findFirst({
        where: {
          googleId: profile.id,
        },
      });

      if (user) {
        return done(null, user);
      }

      const newUser = await prisma.user.create({
        data: {
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: 'google-email',
          password: 'google-auth',
          authMethod: 'google',
        },
      });
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      return done(null, newUser, token);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
      scope: ['profile'],
    },

    async (accessToken, refreshToken, profile, done) => {
      const user = await prisma.user.findFirst({
        where: {
          githubId: profile.id,
        },
      });

      if (user) {
        return done(null, user);
      }

      const newUser = await prisma.user.create({
        data: {
          githubId: profile.id,
          firstName: profile.username,

          email: 'github-email',
          password: 'github-auth',
          authMethod: 'github',
        },
      });
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      return done(null, newUser, token);
    }
  )
);

export default passport;
