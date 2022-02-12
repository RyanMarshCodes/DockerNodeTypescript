import expressLoader from "./express";
import sequelizeLoader from "./sequelize";
import passportLoader from "./passport";

export default async ({ expressApp }: any) => {
    await passportLoader({ app: expressApp });

    await expressLoader({ app: expressApp });

    await sequelizeLoader().then(async (conn) => {
        await conn.authenticate().then(
            () => {
                // tslint:disable-next-line: no-console
                console.log("success");
            },
            (err) => {
                // tslint:disable-next-line: no-console
                console.log(err);
            }
        );
    });
};
