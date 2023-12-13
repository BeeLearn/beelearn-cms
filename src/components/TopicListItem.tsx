"use client";

import Link from "next/link";

import { toast } from "react-toastify";
import { MdCheckCircle, MdCancel, MdDelete, MdEdit, MdMoreVert } from "react-icons/md";

import Topic from "@/api/models/topic.model";
import ListAction from "@/components/ListAction";

type topicListItemProps = {
    topic: Topic,
    isChecked: boolean,
    onEditClick: (topic: Topic) => Promise<void>,
    onDeleteClick: (topic: Topic) => Promise<void>,
    onChecked: (checked: boolean, topic: Topic) => void,
}

export default function TopicListItem({ topic, isChecked, onChecked, onEditClick, onDeleteClick }: topicListItemProps) {
    const topicLink = `topics/${topic.id}/topics/`;

    return (
        <tr>
            <td>
                <input
                    checked={isChecked}
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={
                        (event) => {
                            const checked = event.currentTarget.checked;
                            onChecked(checked, topic);
                        }
                    }/>
            </td>
            <td className="text-violet-700">
                <Link href={topicLink}>{topic.title}</Link>
            </td>
            <td className="text-xl">
                {
                    topic.is_visible ?
                        <MdCheckCircle className="text-green-500" />
                        : <MdCancel className="text-red-500" />
                }
            </td>
            <td>{topic.created_at}</td>
            <td>{topic.updated_at}</td>
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
                                toast.promise(() => onDeleteClick(topic), {
                                    pending: "Deleting topic",
                                    success: "Topic deleted",
                                    error: "An error occur, try again!",
                                });
                            },
                        },

                    ]} />
            </td>
        </tr>
    );
}