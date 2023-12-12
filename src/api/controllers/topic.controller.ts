import Paginate from "../models/paginate.model";
import BreadCrumb from "../models/breadcrumb.model";
import Topic, { TopicBreadCrumb } from "../models/topic.model";

import ApiController, {
  TApiDeleteOption,
  TApiOption,
  TApiPatchOption,
  TApiPostOption,
} from "./api.controller";

export default class TopicController extends ApiController {
  protected apiPath: string = "/api/catalogue/topics/";

  list(options?: TApiOption) {
    return this.get<BreadCrumb<TopicBreadCrumb, Paginate<Topic>>>(options);
  }

  create(options: Pick<TApiPostOption, "data">) {
    return this.post<Topic>(options);
  }

  update(options: Pick<TApiPatchOption, "path" | "data">) {
    return this.patch<Topic>(options);
  }

  remove(options: Pick<TApiDeleteOption, "path" | "query">) {
    return this.delete<null>(options);
  }
}
