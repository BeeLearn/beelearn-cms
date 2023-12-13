import Course from "../models/course.model";
import Paginate from "../models/paginate.model";

import ApiController, {
  type TApiOption,
  type TApiPatchOption,
  type TApiDeleteOption,
  TApiPostOption,
} from "./api.controller";

export default class CourseController extends ApiController {
  protected apiPath: string = "/api/catalogue/courses/";

  retrieve(options?: Pick<TApiOption, "query">) {
    return this.get<Course>(options);
  }

  list(options?: TApiOption) {
    return this.get<Paginate<Course>>(options);
  }

  create(options: Pick<TApiPostOption, "data">) {
    return this.multipartRequest<Course>({
      method: "POST",
      data: this.recordToFormData(options.data),
    });
  }

  update(options: Pick<TApiPatchOption, "data" | "path">, multipart = false) {
    if (multipart) {
      return this.multipartRequest<Course>({
        method: "PATCH",
        data: this.recordToFormData(options.data),
        path: options.path,
      });
    } else {
      return this.patch<Course>({
        data: options.data,
        path: options.path,
      });
    }
  }

  remove(options: Pick<TApiDeleteOption, "path" | "query">) {
    return this.delete<null>(options);
  }
}
