import { Cookies } from "react-cookie";
import ApiImpl from "../api";

export default class Api {
  static #instance: ApiImpl;

  static get accessToken() {
    const cookies = new Cookies(["accessToken"]);
    // if(process.env.NEXT_PUBLIC_ENVIRONMENT && process.env.NEXT_PUBLIC_ENVIRONMENT==="test")
    // return "d7bff2cc72760e5690eef3a1ccc05ba57db70be6";
    return cookies.get("accessToken");
  }

  static get instance(): ApiImpl {
    if (!this.#instance) this.#instance = new ApiImpl(this.accessToken);
    return this.#instance;
  }
}

