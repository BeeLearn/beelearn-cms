"use client";

import React, { useRef, useState } from "react";

import Lesson from "@/api/models/lesson.model";

import { join, type PropsWithClassName } from "@/props";
import type { LoadingState } from "@/features/features";

import LoadMore from "@/components/LoadMore";
import TableSortLabel from "@/widgets/TableSortLabel";

import LessonListItem from "./LessonListItem";
import useMounted from "@/composable/useMounted";
import { DialogElement } from "@/global";
import EditLessonDialog from "@/components/EditLessonDialog ";
import { createPortal } from "react-dom";

type LessonListProps = {
    lessons: Lesson[],
    loadingState: LoadingState["state"],
    loadMore?: (() => Promise<void>) | null,
    onLessonChecked: (Lessons: Array<Lesson>) => void,
    onDelete: (lesson: Lesson) => Promise<void>,
    onEdit: (lesson: Lesson, data: Partial<Lesson>) => Promise<Lesson>,
} & PropsWithClassName;

export default function LessonList({ className, lessons, loadingState, loadMore, onLessonChecked, onEdit, onDelete }: LessonListProps) {
    const mounted = useMounted();

    const [checkedLessons, setCheckedLessons] = useState(new Set<Lesson>());
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const editLessonDialogRef = useRef<DialogElement>(null);

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
                                            setCheckedLessons(new Set(lessons));
                                            onLessonChecked(lessons);
                                        } else {
                                            setCheckedLessons(new Set());
                                            onLessonChecked([]);
                                        }

                                    }
                                } />
                        </th>
                        <th>Name</th>
                        <th>Is visible</th>
                        <TableSortLabel>Created At</TableSortLabel>
                        <TableSortLabel>Updated At</TableSortLabel>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loadingState == "success" && lessons.map((lesson) => (
                            <LessonListItem
                                key={lesson.id}
                                lesson={lesson}
                                isChecked={checkedLessons.has(lesson)}
                                onEditClick={async (lesson) => {
                                    setSelectedLesson(lesson);
                                    setTimeout(() => editLessonDialogRef.current!.showModal());
                                }}
                                onDeleteClick={onDelete}
                                onChecked={
                                    (checked, lesson) => {
                                        if (checked) {
                                            checkedLessons.add(lesson);
                                            onLessonChecked(Array.from(checkedLessons.values()));
                                            setCheckedLessons(new Set(checkedLessons));
                                        } else {
                                            checkedLessons.delete(lesson);
                                            onLessonChecked(Array.from(checkedLessons.values()));
                                            setCheckedLessons(new Set(checkedLessons));
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
                mounted && selectedLesson && createPortal(
                    <EditLessonDialog
                        lesson={selectedLesson}
                        ref={editLessonDialogRef}
                        onSave={onEdit}
                        onDelete={onDelete} />,
                    document.body
                )
            }
        </div>
    );
}
