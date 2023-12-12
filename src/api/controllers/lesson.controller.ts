import Paginate from "../models/paginate.model";
import BreadCrumb from "../models/breadcrumb.model";
import Lesson, { LessonBreadCrumb } from "../models/lesson.model";

import ApiController, {
  TApiDeleteOption,
  TApiOption,
  TApiPatchOption,
  TApiPostOption,
} from "./api.controller";

export default class LessonController extends ApiController {
  protected apiPath: string = "/api/catalogue/lessons/";

  list(options?: TApiOption) {
    return this.get<BreadCrumb<LessonBreadCrumb, Paginate<Lesson>>>(options);
  }

  create(options: Pick<TApiPostOption, "data">) {
    return this.post<Lesson>(options);
  }

  update(options: Pick<TApiPatchOption, "path" | "data">) {
    return this.patch<Lesson>(options);
  }

  remove(options: Pick<TApiDeleteOption, "path" | "query">) {
    return this.delete<null>(options);
  }
}
