import Paginate from "../models/paginate.model";
import Question from "../models/question.model";
import ApiController, {
  TApiDeleteOption,
  TApiOption,
  TApiPatchOption,
  TApiPostOption,
} from "./api.controller";

export default class QuestionController extends ApiController {
  protected apiPath: string = "api/assessment/questions/";

  list(options: TApiOption) {
    return this.get<Paginate<Question>>(options);
  }

  create(options: TApiPostOption) {
    return this.post<Question>(options);
  }

  update(options: Pick<TApiPatchOption, "data" | "path" | "query">) {
    return this.patch<Question>(options);
  }

  remove(options: Pick<TApiDeleteOption, "path" | "query">) {
    return this.delete<null>(options);
  }
}
