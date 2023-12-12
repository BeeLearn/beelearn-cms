import Course from "./course.model";
import Timestamp from "./timestamp.model";

export default interface Module extends Timestamp {
  id: number;
  name: string;
  description?: string;
  is_visible: boolean;
}

export type ModuleBreadCrumb = {
  course: Pick<Course, "id" | "name">;
};
