import User from "../models/user.model";
import ApiController, { TApiOption, TApiPatchOption } from "./api.controller";

export default class UserController extends ApiController {
  protected apiPath: string = "/api/account/users/";

  currentUser(options?: Pick<TApiOption, "query">) {
    return this.get<User>({
      path: "current-user",
      ...options,
    });
  }

  updateCurrentUser(options: Pick<TApiPatchOption, "data">) {
    return this.patch<User>({
      path: "current-user",
      ...options,
    });
  }
}
