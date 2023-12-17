import { Cookies } from "react-cookie";
import ApiImpl from "../api/index";

export default class Api {
  static #instance: ApiImpl;

  static get accessToken() {
    const cookie = new Cookies(["accessToken"]);
    // return cookie.get("accessToken");
    return "d7bff2cc72760e5690eef3a1ccc05ba57db70be6";
  }

  static get instance(): ApiImpl {
    if (!this.#instance) this.#instance = new ApiImpl(this.accessToken);
    return this.#instance;
  }
}
