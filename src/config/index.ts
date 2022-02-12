import dotenv from "dotenv";
import { Options } from "sequelize/types";

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
    port: parseInt(process.env.SERVER_PORT, 10),
    api: {
        prefix: "/api",
    },
    sequelize: {
        database: process.env.SQL_DATABASE,
        user: process.env.SQL_USERNAME,
        password: process.env.SQL_PASSWORD,
        server: process.env.SQL_HOSTNAME,
        port: parseInt(process.env.SQL_PORT, 10),
        dialectOptions: {
            useUTC: true,
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
    },
    okta: {
        issuer: process.env.OKTA_OAUTH2_ISSUER,
        scope: process.env.OKTA_SCOPE,
        clientId: process.env.OKTA_OAUTH2_CLIENT_ID,
        clientSecret: process.env.OKTA_OAUTH2_CLIENT_SECRET,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    battleNet: {
        clientId: process.env.BATTLENET_CLIENTID,
        secret: process.env.BATTLENET_SECRET,
    },
};
