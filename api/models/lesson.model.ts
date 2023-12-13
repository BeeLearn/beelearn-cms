import Timestamp from "./timestamp.model";
import Module, { ModuleBreadCrumb } from "./module.model";

export default interface Lesson extends Timestamp {
  id: number;
  name: string;
  description?: string;
  is_visible: boolean;
}

export type LessonBreadCrumb = ModuleBreadCrumb & {
  module: Pick<Module, "id" | "name">;
};
