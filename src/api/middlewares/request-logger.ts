import { NextFunction, Request, Response } from "express";
import { LogEntry } from "../../models/logentry.model";
import moment from "moment";

export default async (req: Request, res: Response, next: NextFunction) => {
    let start: moment.Moment;
    let finish: moment.Moment;
    let close: moment.Moment;
    let totalResponseTime: number;
    let responseBody: any;

    start = moment.utc();

    res.on("finish", () => {
        finish = moment.utc();
    });

    res.on("close", async () => {
        close = moment.utc();
        totalResponseTime = getDurationInMilliseconds(start, close);

        const logEntry = await LogEntry.create({
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            requestBody: JSON.stringify(req.body),
            requestStart: start,
            responseClose: close,
            responseFinish: finish,
            totalResponseTime,
            requestRemoteAddr: req.ip?.split(`:`).pop(),
            requestHeaders: JSON.stringify(req.headers),
            responseBody,
            responseHeaders: JSON.stringify(res.getHeaders()),
            responseStatus: res.statusCode,
        });
    });

    const oldSend = res.send;

    res.send = (data) => {
        responseBody = data; // do something with the data
        res.send = oldSend; // set function back to avoid the 'double-send'
        return res.send(data); // just call as normal with data
    };

    return next();
};

const getDurationInMilliseconds = (start: any, finish: moment.Moment) => {
    const diff = finish.diff(start);
    return diff;
};
