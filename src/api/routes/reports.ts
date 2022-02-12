import { Token } from "./../../models/token.model";
import { WarcraftLogsService } from "./../../services/warcraftlogs.services";
import { Router, Request, Response } from "express";
import { wclAuthenticationRequired } from "../middlewares/wcl-auth.middleware";
import { IRequestWithUser } from "../../models/APIModels/IRequestWithUser.model";
import { Report } from "../../models/report.model";

const route = Router();

export default async (app: Router) => {
    app.use("/reports", route);

    route.get(
        "",
        wclAuthenticationRequired,
        async (req: IRequestWithUser, res: Response) => {
            const wclService = new WarcraftLogsService(req.user.accessToken);
            const data = await wclService.getReportsForGuild(
                "Endure",
                "zuljin",
                "us"
            );
            return res.json({ data }).status(200);
        }
    );

    route.get(
        "/:region/:server/:guild",
        async (req: IRequestWithUser, res: Response) => {
            const region = req.params.region;
            const server = req.params.server;
            const guild = req.params.guild;

            const wclService = new WarcraftLogsService(req.user.accessToken);
            await wclService
                .getReportsForGuild(guild, server, region)
                .then((data) => {
                    if (data.error) {
                        return res.json({ error: data.error }).status(400);
                    } else {
                        return res.json({ data }).status(200);
                    }
                })
                .catch((err) => {
                    return res.json({ error: err.message }).status(400);
                });
        }
    );

    route.get(
        "/:id",
        wclAuthenticationRequired,
        async (req: IRequestWithUser, res: Response) => {
            let report;

            const existingReport = await Report.findOne({
                where: {
                    code: req.params.id,
                },
            });

            if (existingReport) {
                report = JSON.parse(existingReport.data);
            } else {
                const wclService = new WarcraftLogsService(
                    req.user.accessToken
                );

                report = await wclService.getReport(req.params.id);
            }

            return res.json({ report }).status(200);
        }
    );
};
