import config from "../config";
import axios, { AxiosError } from "axios";

import FormData from "form-data";

export class BattleNetService {
  _accessToken: string;
  clientId: string;
  secret: string;

  baseUrl: string;

  constructor(accessToken?: string) {
    this.clientId = config.battleNet.clientId;
    this.secret = config.battleNet.secret;
    this.baseUrl = "https://us.battle.net";

    if (accessToken !== null) {
      this._accessToken = accessToken;
    }
  }

  async getClientCredentials(): Promise<any> {
    let postData = new FormData();
    postData.append("grant_type", "client_credentials");

    let headers = postData.getHeaders();
    headers["Authorization"] =
      "Basic " + getBasic64String(this.clientId + ":" + this.secret);

    console.log(postData);

    const response = await axios.post(`${this.baseUrl}/oauth/token`, postData, {
      headers,
    });

    if (response?.data) {
      this._accessToken = response.data.access_token;
    }

    return response.data;
  }

  async getServers(): Promise<any> {
    const response = await axios.get(
      `https://us.api.blizzard.com/data/wow/realm/index?namespace=dynamic-us&locale=en_US&access_token=${this._accessToken}`
    );

    let data = response?.data;
    data.realms.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (b.name > a.name) return -1;

      return 0;
    });

    return response?.data;
  }
}

function getBasic64String(input: string) {
  return btoa(input);
}
