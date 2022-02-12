import { NextFunction, Response } from "express";
import moment from "moment";
import { Token } from "../../models/token.model";
import { IRequestWithUser } from "../../models/APIModels/IRequestWithUser.model";
import { BattleNetService } from "../../services/battlenet.service";

export async function updateBnetToken(
    req: IRequestWithUser,
    res: Response,
    next: NextFunction
) {
    const bnetService = new BattleNetService(null);
    let existingToken = await Token.findOne({
        where: {
            tokenType: "bnet",
            userId: 0,
        },
    });

    if (!existingToken || moment(existingToken?.expires) < moment()) {
        let data = await bnetService.getClientCredentials();

        if (data) {
            console.log("New access token grabbed for Bnet");

            const [token, tokenCreated] = await Token.findOrCreate({
                where: {
                    userId: "0",
                    tokenType: "bnet",
                },
            });

            token.accessToken = data.access_token;
            token.expires = moment(Date.now() + data.expires_in).toDate();

            token.save();

            existingToken = token;
        }
    }

    req.bnetToken = existingToken.accessToken;

    return next();
}
