import { User } from "./../../models/user.model";
import passport from "passport";
import { Router, Request, Response } from "express";
import OktaJwtVerifier, { Jwt } from "@okta/jwt-verifier";
import config from "../../config";
import { authenticationRequired } from "../middlewares/auth.middleware";
import sequelizeLoader from "../../loaders/sequelize";

const route = Router();

const verifier = new OktaJwtVerifier({
  issuer: config.okta.issuer,
  clientId: config.okta.clientId,
});

export default async (app: Router) => {
  app.use("/auth", route);

  route.get(
    "/okta",
    authenticationRequired,
    async (req: any, res: Response) => {
      let user = null;

      if (req.jwt) {
        const jwt: Jwt = req.jwt as Jwt;

        for (const [key, value] of Object.entries(jwt.claims)) {
          // tslint:disable-next-line: no-console
          console.log(`${key}: ${value}`);
        }

        await sequelizeLoader().then(async (conn) => {
          await conn.transaction(async (transaction) => {
            await User.findOrCreate({
              where: {
                id: jwt.claims.sub,
                emailAddress: jwt.claims.email,
                displayName: jwt.claims.fullName,
              },
              transaction,
            }).then(async ([createdUser, created]) => {
              user = createdUser;
            });
          });
        });
      }

      return res.json({ user }).status(200);
    }
  );

  route.get("/wcl", passport.authenticate("oauth2", { session: true }));
  route.get("/wcl/callback", (req: any, res: any, next) => {
    passport.authenticate("oauth2", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.redirect("http://localhost:3000/login");
      }
      req.logIn(user, (err2) => {
        if (err2) {
          return next(err2);
        }

        req.user = user;

        res.redirect(
          "http://localhost:3000/login/callback?code=" +
            user.accessToken +
            "&id=" +
            user.id +
            "&name=" +
            user.name
        );
      });
    })(req, res, next);
  });

  route.get("/discord", passport.authenticate("discord", { session: true }));
};
