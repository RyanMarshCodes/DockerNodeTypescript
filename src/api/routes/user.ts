import { Router, Request, Response } from 'express';
import { authenticationRequired } from '../middlewares/auth.middleware';

const route = Router();

export default (app: Router) => {
    app.use('/user', route);

    route.get('', authenticationRequired, (req: Request, res: Response) => {
        return res.json({ hello: 'world' }).status(200);
    });
};
