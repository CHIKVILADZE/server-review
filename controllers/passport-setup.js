import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
      profile.accessToken = accessToken;
      const user = await prisma.user.findFirst({
        where: {
          googleId: profile.id,
        },
      });
      console.log('userrrrr', user);

      if (user) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        return done(null, user);
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('google-auth-password', salt);

      const newUser = await prisma.user.create({
        data: {
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.email,
          password: hashedPassword,
          authMethod: 'google',
        },
      });
      console.log('newUSerrr', newUser);

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY);
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
      console.log('aceessssToken', accessToken);

      const user = await prisma.user.findFirst({
        where: {
          githubId: profile.id,
        },
      });

      if (user) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        return done(null, user, { accessToken: token });
      }

      console.log('userrrrr', user);
      const newUser = await prisma.user.create({
        data: {
          githubId: profile.id,
          firstName: profile.username,
          authMethod: 'github',
        },
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY);
      console.log('aceessssToken', accessToken);
      return done(null, newUser, { accessToken: token });
    }
  )
);

export default passport;
