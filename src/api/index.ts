import { Router } from "express";
import user from "./routes/user";
import auth from "./routes/auth";
import reports from "./routes/reports";
import bnet from "./routes/bnet";

// guaranteed to get dependencies
export default () => {
    const app: Router = Router();

    user(app);
    auth(app);
    reports(app);
    bnet(app);

    return app;
};
