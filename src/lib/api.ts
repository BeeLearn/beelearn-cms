import ApiImpl from "../api/index";

export default class Api {
  private static _accessToken?: string;

  static set accessToken(value: string) {
    Api.instance = new ApiImpl(value);
    this._accessToken = value;
  }

  static get accessToken() {
    return this._accessToken!;
  }

  static instance: ApiImpl;
}
