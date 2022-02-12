import { Sequelize } from "sequelize-typescript";
import fs from "fs";
import path from "path";
import config from "../config";
import { User } from "../models/user.model";
import { Token } from "../models/token.model";
import { BattleNetService } from "../services/battlenet.service";
import moment from "moment";

export default async (): Promise<Sequelize> => {
    const conn = new Sequelize(
        config.sequelize.database,
        config.sequelize.user,
        config.sequelize.password,
        {
            host: config.sequelize.server,
            port: config.sequelize.port,
            dialect: "mssql",
            dialectOptions: {
                useUTC: true,
                options: {
                    requestTimeout: 30000,
                },
            },
            pool: {
                max: 5,
                min: 0,
                idle: 10000,
            },
            storage: ":memory:",
            models: [path.resolve(__dirname, "../models")],
            modelMatch: (filename, member) => {
                return (
                    filename.substring(0, filename.indexOf(".model")) ===
                    member.toLowerCase()
                );
            },
        }
    );

    await conn.sync({ alter: true });

    let systemUser: User;
    let userCreated: boolean;
    let systemToken: Token;
    let tokenCreated: boolean;

    await conn.transaction(async (t) => {
        [systemUser, userCreated] = await User.findOrCreate({
            transaction: t,
            where: {
                id: "0",
                displayName: "System",
                emailAddress: "system@ryanmarsh.net",
            },
        });
    });

    if (systemUser) {
        await new BattleNetService(null)
            .getClientCredentials()
            .then(async (data: any) => {
                await conn.transaction(async (t) => {
                    [systemToken, tokenCreated] = await Token.findOrCreate({
                        where: {
                            userId: "0",
                            tokenType: "bnet",
                            accessToken: data.access_token,
                        },
                        transaction: t,
                    });
                });

                await systemToken.update({
                    expires: moment(Date.now() + data.expires_in).utc(),
                });
            });

        if (tokenCreated) {
            console.log(
                `BNet Token ${systemToken.id} created for User ID ${systemUser.id}`
            );
        }
    }

    return conn;
};
