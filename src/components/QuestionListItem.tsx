"use client";

import Link from "next/link";

import { toast } from "react-toastify";
import { MdCheckCircle, MdCancel, MdDelete, MdEdit, MdMoreVert } from "react-icons/md";

import Question from "@/api/models/question.model";
import ListAction from "@/components/ListAction";

type QuestionListItemProps = {
    question: Question,
    isChecked: boolean,
    onEditClick: (question: Question) => Promise<void>,
    onDeleteClick: (question: Question) => Promise<void>,
    onChecked: (checked: boolean, question: Question) => void,
}

export default function QuestionListItem({ question, isChecked, onEditClick, onDeleteClick, onChecked }: QuestionListItemProps) {
    const questionLink = `questions/${question.id}/lessons/`;

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
                            onChecked(checked, question);
                        }
                    } />
            </td>
            <td className="text-violet-700">
                <Link href={questionLink}>{question.title}</Link>
            </td>
            <td className="text-xl">
                {
                    question.choices ?
                        <MdCheckCircle className="text-green-500" />
                        : <MdCancel className="text-red-500" />
                }
            </td>
            <td>{question.created_at}</td>
            <td>{question.updated_at}</td>
            <td>
                <ListAction
                    actionClass="btn"
                    actionButton={<MdMoreVert className="text-xl" />}
                    actions={[
                        {
                            text: "Edit",
                            icon: <MdEdit className="text-xl" />,
                            onSelect() {
                                onEditClick(question);
                            },
                        },
                        {
                            text: "Delete",
                            icon: <MdDelete className="text-xl" />,
                            onSelect() {
                                toast.promise(() => onDeleteClick(question), {
                                    pending: "Deleting question",
                                    success: "Question deleted",
                                    error: "An error occur, try again!",
                                });
                            },
                        },

                    ]} />
            </td>
        </tr>
    );
}