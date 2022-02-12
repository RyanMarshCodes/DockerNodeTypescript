import { Response, Router } from "express";
import { Token } from "../../models/token.model";
import { IRequestWithUser } from "../../models/APIModels/IRequestWithUser.model";
import { BattleNetService } from "../../services/battlenet.service";
import moment from "moment";
import { updateBnetToken } from "../middlewares/update-bnet-token";

const route = Router();

export default async (app: Router) => {
    app.use("/bnet", route);

    route.get(
        "/servers",
        updateBnetToken,
        async (req: IRequestWithUser, res: Response) => {
            let data = await new BattleNetService(req.bnetToken).getServers();

            res.json({ data }).status(200);
        }
    );
};
