import express from 'express';
import path from 'path';
import config from './config';
import routes from './api';

async function startServer() {
    const app = express();

    await require('./loaders').default({ expressApp: app });

    /**
     * Start server listener
     */
    app.listen(config.port, () => {
        // tslint:disable-next-line: no-console
        console.log(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################`);
    }).on('error', (err) => {
        // tslint:disable-next-line: no-console
        console.error(err);
        process.exit(1);
    });
}

startServer();
