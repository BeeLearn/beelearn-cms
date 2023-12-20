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

import Topic from "@/api/models/topic.model";
import ListAction from "@/components/ListAction";

type topicListItemProps = {
  topic: Topic;
  isChecked: boolean;
  onEditClick: (topic: Topic) => Promise<void>;
  onDeleteClick: (topic: Topic) => Promise<void>;
  onChecked: (checked: boolean, topic: Topic) => void;
};

export default function TopicListItem({
  topic,
  isChecked,
  onChecked,
  onEditClick,
  onDeleteClick,
}: topicListItemProps) {

  return (
    <tr>
      <td>
        <input
          checked={isChecked}
          type="checkbox"
          className="cursor-pointer"
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            onChecked(checked, topic);
          }}
        />
      </td>
      <td className="text-violet-700">
        <p>{topic.title}</p>
      </td>
      <td className="text-xl">
        {topic.is_visible ? (
          <MdCheckCircle className="text-green-500" />
        ) : (
          <MdCancel className="text-red-500" />
        )}
      </td>
      <td>{moment(topic.created_at).fromNow()}</td>
      <td>{moment(topic.updated_at).fromNow()}</td>
      <td>
        <ListAction
          actionClass="btn"
          actionButton={<MdMoreVert className="text-xl" />}
          actions={[
            {
              text: "Edit",
              icon: <MdEdit className="text-xl" />,
              onSelect() {
                onEditClick(topic);
              },
            },
            {
              text: "Delete",
              icon: <MdDelete className="text-xl" />,
              onSelect() {
                onDeleteClick(topic);
              },
            },
          ]}
        />
      </td>
    </tr>
  );
}
