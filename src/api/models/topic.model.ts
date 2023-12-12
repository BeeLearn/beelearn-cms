import Timestamp from "./timestamp.model";
import { ModuleBreadCrumb } from "./module.model";
import TopicQuestion from "./topicQuestion.model";
import Lesson, { LessonBreadCrumb } from "./lesson.model";

export default interface Topic extends Timestamp {
  id: number;
  title: string;
  description?: string,
  content: string;
  topic_questions: TopicQuestion[];
  is_visible: boolean;
}

export type TopicBreadCrumb = ModuleBreadCrumb &
  LessonBreadCrumb & {
    lesson: Pick<Lesson, "id" | "name">;
  };
