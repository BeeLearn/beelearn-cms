"use client";

import React, { useState, useRef } from "react";

import Course from "@/api/models/course.model";
import { PropsWithClassName, join } from "@/props";

import LoadMore from "@/components/LoadMore";
import TableSortLabel from "@/widgets/TableSortLabel";
import { LoadingState } from "@/features/features";

import CourseListItem from "./CourseListItem";
import { createPortal } from "react-dom";
import useMounted from "@/composable/useMounted";
import EditCourseDialog from "@/components/EditCourseDialog";
import { DialogElement } from "@/global";

type CourseListProps = {
    courses: Course[],
    loadingState: LoadingState["state"],
    loadMore?: (() => Promise<void>) | null,
    onCourseChecked: (courses: Array<Course>) => void,
    onDelete: (course: Course) => Promise<void>,
    onEdit: (course: Course, data: Partial<Course>, multipart: boolean) => Promise<Course>,
} & PropsWithClassName;

export default function CourseList({ className, courses, loadingState, loadMore, onCourseChecked, onEdit, onDelete }: CourseListProps) {
    const mounted = useMounted();

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [checkedCourses, setCheckedCourses] = useState(new Set<Course>());

    const editCourseDialogRef = useRef<DialogElement>(null);

    return (
        <div className={join("table-container flex flex-col", className)}>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={
                                    (event) => {
                                        const checked = event.currentTarget.checked;

                                        if (checked) {
                                            setCheckedCourses(new Set(courses));
                                            onCourseChecked(courses);
                                        } else {
                                            setCheckedCourses(new Set());
                                            onCourseChecked([]);
                                        }

                                    }
                                } />
                        </th>
                        <th>Illustration</th>
                        <th>Name</th>
                        <th>Is visible</th>
                        <TableSortLabel>Created At</TableSortLabel>
                        <TableSortLabel>Updated At</TableSortLabel>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loadingState == "success" && courses.map((course) => (
                            <CourseListItem
                                key={course.id}
                                course={course}
                                isChecked={checkedCourses.has(course)}
                                onEditClick={async (course) => {
                                    setSelectedCourse(course);
                                    setTimeout(() => editCourseDialogRef.current!.showModal());
                                }}
                                onDeleteClick={onDelete}
                                onChecked={
                                    (checked, course) => {
                                        if (checked) {
                                            checkedCourses.add(course);
                                            onCourseChecked(Array.from(checkedCourses.values()));
                                            setCheckedCourses(new Set(checkedCourses));
                                        } else {
                                            checkedCourses.delete(course);
                                            onCourseChecked(Array.from(checkedCourses.values()));
                                            setCheckedCourses(new Set(checkedCourses));
                                        }

                                    }
                                } />
                        ))
                    }
                </tbody>
            </table>
            {
                (loadingState == "idle" || loadingState == "pending") && <div className="flex-1 flex justify-center items-center">
                    <div className="s-8 progress progress-primary" />
                </div>
            }

            {
                loadMore && <LoadMore onClick={loadMore} />
            }

            {
                mounted && selectedCourse && createPortal(
                    <EditCourseDialog
                        course={selectedCourse}
                        ref={editCourseDialogRef}
                        onSave={onEdit}
                        onDelete={onDelete} />,
                    document.body
                )
            }
        </div>
    );
}
