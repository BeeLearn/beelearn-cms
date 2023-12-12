import Tag from "./tag.model";
import Timestamp from "./timestamp.model";

export default interface Course extends Timestamp {
  id: number;
  name: string;
  tags: Tag[];
  is_visible: boolean,
  illustration: string,
  description?: string;
}
