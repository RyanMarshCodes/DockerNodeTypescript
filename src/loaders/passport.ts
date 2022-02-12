import OAuth2Strategy, { VerifyCallback } from "passport-oauth2";
import passport from "passport";
import express, { NextFunction, Request, Response } from "express";
import { GraphQLClient, gql } from "graphql-request";
import sequelizeLoader from "../loaders/sequelize";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";

export default ({ app }: { app: express.Application }) => {
  passport.use(
    new OAuth2Strategy(
      {
        authorizationURL: "https://www.warcraftlogs.com/oauth/authorize",
        tokenURL: "https://www.warcraftlogs.com/oauth/token",
        clientID: "93a99856-f4ab-474b-a594-954bde3efe06",
        clientSecret: "SC7h8V3cmUe32J5VKlN5ELBGonEShEXg3ii3HcPG",
        callbackURL: "http://localhost:8080/api/auth/wcl/callback",
        pkce: true,
        state: true,
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        params: any,
        profile: any,
        done: VerifyCallback
      ) => {
        if (accessToken) {
          console.log(accessToken);
          const { id, name, battleTag } = await getUserDataFromWCLByAccessToken(
            accessToken
          );
          try {
            await sequelizeLoader().then(async (conn) => {
              const transaction = await conn.transaction();

              const [user, userCreated] = await User.findOrCreate({
                where: {
                  id,
                  emailAddress: name + "@ryanmarshcodes.github.io",
                  displayName: name,
                  battleTag: battleTag,
                },
                transaction,
              });

              await transaction.commit();

              if (user) {
                const transaction2 = await conn.transaction();

                const [token, tokenCreated] = await Token.findOrCreate({
                  where: {
                    userId: user.id,
                    tokenType: "warcraftlogs",
                  },
                  transaction: transaction2,
                });

                if (token) {
                  console.log(token);
                  token.accessToken = accessToken;
                  token.refreshToken = refreshToken;
                  token.expires = addTimeToDate(
                    Date.now(),
                    params?.expires_in || 0
                  );

                  await token.save({
                    transaction: transaction2,
                  });
                }

                await transaction2.commit();

                return done(null, {
                  id: user.guid,
                  name: user.displayName,
                  accessToken,
                });
              }
            });
          } catch (err) {
            return done(err, null);
          }
        } else {
          return done(null, req.user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};

async function getUserDataFromWCLByAccessToken(accessToken: string) {
  const userDataQuery = gql`
    {
      userData {
        currentUser {
          id
          name
          battleTag
        }
      }
    }
  `;

  const gqlClient = new GraphQLClient(
    "https://www.warcraftlogs.com/api/v2/user/",
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await gqlClient.request(userDataQuery);

  return data.userData.currentUser;
}

function addTimeToDate(startDate: number, millisToAdd: number): Date {
  return new Date(startDate + millisToAdd);
}
