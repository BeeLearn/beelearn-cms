import Question, { type ContentTypes } from "./question.model";

export default interface TopicQuestion {
  id: number;
  question: Question | Record<string, any>;
  question_content_type: keyof typeof ContentTypes;
}
