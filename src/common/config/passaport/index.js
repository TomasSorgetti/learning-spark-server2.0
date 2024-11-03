const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { serverConfig } = require('../');
const db = require('../../../database/index.js');

passport.use(
  new GoogleStrategy(
    {
      clientID: serverConfig.GOOGLE_CLIENT_ID,
      clientSecret: serverConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: `${serverConfig.SERVER_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await db.user.findOne({
          where: { email: profile.emails[0].value.trim().toLowerCase() },
        });

        if (!user) {
          const [firstName, ...lastNameParts] = profile.displayName.split(' ');
          const lastName = lastNameParts.join(' ');

          const newUser = await db.user.create({
            email: profile.emails[0].value,
            name: firstName,
            lastname: lastName,
            googleId: profile.id,
            verified: true,
          });
          const isOwner = profile.emails[0].value === process.env.OWNER_EMAIL;
          const role = await db.role.findOne({
            where: { name: isOwner ? 'Owner' : 'User' },
          });
          await newUser.addRole(role);
          await newUser.reload({
            include: [
              {
                model: db.role,
                as: 'roles',
              },
            ],
          });
          return done(null, newUser);
        }
        if (user.deleted) {
          return done(null, false, { message: 'User is deleted' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
