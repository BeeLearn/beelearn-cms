import type Tag from "../models/tag.model";
import type Paginate from "../models/paginate.model";

import Api, { type TApiOption } from "./api.controller";

export default class TagController extends Api {
  protected apiPath: string = "/api/metadata/tags/";

  list(options: TApiOption) {
    return this.get<Paginate<Tag>>(options);
  }
}
