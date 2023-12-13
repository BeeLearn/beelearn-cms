import Paginate from "../models/paginate.model";
import BreadCrumb from "../models/breadcrumb.model";
import Module, { ModuleBreadCrumb } from "../models/module.model";

import ApiController, {
  TApiDeleteOption,
  TApiOption,
  TApiPatchOption,
  TApiPostOption,
} from "./api.controller";

export default class ModuleController extends ApiController {
  protected apiPath: string = "/api/catalogue/modules/";

  list(options?: TApiOption) {
    return this.get<BreadCrumb<ModuleBreadCrumb, Paginate<Module>>>(options);
  }

  create(options: Pick<TApiPostOption, "data">) {
    return this.post<Module>(options);
  }

  update(options: Pick<TApiPatchOption, "path" | "data">) {
    return this.patch<Module>(options);
  }

  remove(options: Pick<TApiDeleteOption, "path" | "query">) {
    return this.delete<null>(options);
  }
}
