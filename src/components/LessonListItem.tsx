"use client";

import moment from "moment";
import Link from "next/link";

import { toast } from "react-toastify";
import {
  MdCheckCircle,
  MdCancel,
  MdDelete,
  MdEdit,
  MdMoreVert,
} from "react-icons/md";

import Lesson from "@/api/models/lesson.model";
import ListAction from "@/components/ListAction";

type LessonListItemProps = {
  lesson: Lesson;
  isChecked: boolean;
  onEditClick: (lesson: Lesson) => Promise<void>;
  onDeleteClick: (lesson: Lesson) => Promise<void>;
  onChecked: (checked: boolean, lesson: Lesson) => void;
};

export default function LessonListItem({
  lesson,
  isChecked,
  onChecked,
  onDeleteClick,
  onEditClick,
}: LessonListItemProps) {
  const lessonLink = `lessons/${lesson.id}/topics/`;

  return (
    <tr>
      <td>
        <input
          checked={isChecked}
          type="checkbox"
          className="cursor-pointer"
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            onChecked(checked, lesson);
          }}
        />
      </td>
      <td className="text-violet-700">
        <Link href={lessonLink}>{lesson.name}</Link>
      </td>
      <td className="text-xl">
        {lesson.is_visible ? (
          <MdCheckCircle className="text-green-500" />
        ) : (
          <MdCancel className="text-red-500" />
        )}
      </td>
      <td>{moment(lesson.created_at).fromNow()}</td>
      <td>{moment(lesson.updated_at).fromNow()}</td>
      <td>
        <ListAction
          actionClass="btn"
          actionButton={<MdMoreVert className="text-xl" />}
          actions={[
            {
              text: "Edit",
              icon: <MdEdit className="text-xl" />,
              onSelect() {
                onEditClick(lesson);
              },
            },
            {
              text: "Delete",
              icon: <MdDelete className="text-xl" />,
              onSelect() {
                onDeleteClick(lesson);
              },
            },
          ]}
        />
      </td>
    </tr>
  );
}
