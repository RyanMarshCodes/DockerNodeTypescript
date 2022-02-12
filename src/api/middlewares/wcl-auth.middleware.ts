import { NextFunction, Request, Response } from "express";
import { Token } from "../../models/token.model";

export function wclAuthenticationRequired(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("user", req.user);
    console.log("session", req.session);
    if (!req.session) {
        return next("Unauthorized");
    } else {
        return next();
    }
}
