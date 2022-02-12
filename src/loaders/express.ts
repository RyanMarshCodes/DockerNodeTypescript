import { Token } from "./../models/token.model";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import routes from "../api";
import config from "../config";
import requestLogger from "../api/middlewares/request-logger";
import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback } from "passport-oauth2";
import { gql, GraphQLClient } from "graphql-request";
import expressSession from "express-session";
import sequelizeLoader from "./sequelize";
import { User } from "../models/user.model";
import redis from "redis";
import * as connectRedis from "connect-redis";

// tslint:disable: no-console
export default ({ app }: { app: express.Application }) => {
    const redisStore = connectRedis.default(expressSession);
    const rediscli = redis.createClient({
        host: config.redis.host,
        port: Number(config.redis.port),
    });

    rediscli.on("connect", (err) => {
        console.log("Connected to redis");
    });

    /**
     * Enable CORS
     */
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    /**
     * Enable Compression
     */
    app.use(compression());

    /** Use new body-parser stuff */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    /**
     * Request & Response Logging
     */
    app.use(requestLogger);

    app.use(
        expressSession({
            secret: "supersecretstring",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: "auto",
                maxAge: 1000 * 60 * 60 * 24 * 30,
            },
            store: new redisStore({
                client: rediscli,
            }),
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    /**
     * Health checks & no directory browse...
     */
    app.get("/status", (req: Request, res: Response) => {
        res.status(200).json({ status: "Working!" });
    });
    app.head("/status", (req: Request, res: Response) => {
        res.status(200).end();
    });

    app.get("/me", (req: Request, res: Response) => {
        res.status(200).json(req.user);
    });

    app.use(config.api.prefix, routes());

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({ error: err });
    });

    // Disable directory browse by sending 404
    app.get(["", "/", "/*"], (req: Request, res: Response) => {
        res.status(404).json({ error: "Resource not found" });
    });
};
