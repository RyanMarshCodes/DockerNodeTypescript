require('dotenv').config();
const axios = require('axios');

const {
    OKTA_OAUTH2_ISSUER,
    OKTA_OAUTH2_CLIENT_ID,
    OKTA_OAUTH2_CLIENT_SECRET,
    OKTA_SCOPE,
} = process.env;

const [, , url, method, body] = process.argv;
if (!url) {
    console.log('Usage: node client {url} [{method}] [{jsonData}]');
    process.exit(1);
}

const sendAPIRequest = async () => {
    try {
        const auth = await axios({
            url: `${OKTA_OAUTH2_ISSUER}/v1/token`,
            method: 'post',
            auth: {
                username: OKTA_OAUTH2_CLIENT_ID,
                password: OKTA_OAUTH2_CLIENT_SECRET,
            },
            params: {
                grant_type: 'client_credentials',
                scope: OKTA_SCOPE,
            },
        });

        const response = await axios({
            url,
            method: method ?? 'get',
            data: body ? JSON.parse(body) : null,
            headers: {
                authorization: `${auth.data.token_type} ${auth.data.access_token}`,
            },
        });

        console.log(response.data);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

sendAPIRequest();
