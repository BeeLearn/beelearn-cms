"use client";

import Image from "next/image";
import Link from "next/link";

import { MdCheckCircle, MdCancel, MdDelete, MdEditNote, MdMoreHoriz, MdEdit, MdMoreVert } from "react-icons/md";

import Course from "@/api/models/course.model";
import ListAction from "@/components/ListAction";
import { toast } from "react-toastify";

type CourseListItemProps = {
    course: Course,
    isChecked: boolean,
    onEditClick: (course: Course) => Promise<void>,
    onDeleteClick: (course: Course) => Promise<void>,
    onChecked: (checked: boolean, course: Course) => void,
}

export default function CourseListItem({ course, isChecked, onChecked, onEditClick, onDeleteClick }: CourseListItemProps) {
    const moduleLink = `/courses/${course.id}/modules/`;

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
                            onChecked(checked, course);
                        }
                    } />
            </td>
            <td className="flex items-center justify-center">
                <Image
                    alt={course.name}
                    src={course.illustration}
                    width="128"
                    height="128"
                    className="w-12 h-12 rounded" />
            </td>
            <td className="text-violet-700">
                <Link href={moduleLink}>{course.name}</Link>
            </td>
            <td className="text-xl">
                {
                    course.is_visible ?
                        <MdCheckCircle className="text-green-500" />
                        : <MdCancel className="text-red-500" />
                }
            </td>
            <td>{course.created_at}</td>
            <td>{course.updated_at}</td>
            <td>
                <ListAction
                    actionClass="btn"
                    actionButton={<MdMoreVert className="text-xl" />}
                    actions={[
                        {
                            text: "Edit",
                            icon: <MdEdit className="text-xl" />,
                            onSelect() {
                                onEditClick(course);
                            },
                        },
                        {
                            text: "Delete",
                            icon: <MdDelete className="text-xl" />,
                            onSelect() {
                                toast.promise(() => onDeleteClick(course), {
                                    pending: "Deleting course",
                                    success: "Course deleted",
                                    error: "An error occur, try again!",
                                });
                            },
                        },

                    ]} />
            </td>
        </tr>
    );
}