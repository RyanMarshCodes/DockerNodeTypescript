import { NextFunction, Response, Request } from 'express';
import OktaJwtVerifier from '@okta/jwt-verifier';
import config from '../../config';

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: config.okta.issuer,
    clientId: config.okta.clientId,
});

export function authenticationRequired(req: any, res: any, next: NextFunction) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);
    // The expected audience passed to verifyAccessToken() is required, and can be either a string (direct match) or
    // an array  of strings (the actual aud claim in the token must match one of the strings).
    const expectedAudience = 'api://default';

    if (!match) {
        res.status(401);
        return next('Unauthorized');
    }

    const accessToken = match[1];

    return oktaJwtVerifier
        .verifyAccessToken(accessToken, expectedAudience)
        .then((jwt: OktaJwtVerifier.Jwt) => {
            req.jwt = jwt;
            next();
        })
        .catch((err: Error) => {
            res.status(401).send(err.message);
        });
}
