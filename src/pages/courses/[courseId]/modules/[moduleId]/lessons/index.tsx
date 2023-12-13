"use client";

import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { MdOutlineTag, MdOutlineDelete } from "react-icons/md";

import Api from "@/lib/api";
import Lesson from "@/api/models/lesson.model";

import type { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getLessons, lessonActions, lessonSelector } from "@/features/lessonSlice";

import Search from "@/components/Search";
import ListAction from "@/components/ListAction";
import LessonList from "@/components/LessonList";
import LessonLayoutHeader from "@/components/LessonLayoutHeader";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import CreateNewLessonDialog from "@/components/CreateNewLessonDialog";

export default function LessonsPage({ params }: { params: { moduleId: number } }) {
    const mounted = useMounted();
    const confirmDeleteDialogRef = useRef<DialogElement>(null);
    const createNewLessonDialogRef = useRef<DialogElement>(null);

    const dispatch = useAppDispatch();
    const state = useAppSelector((store) => store.lesson);
    const lessons = lessonSelector.selectAll(state);

    const [checkedLessons, setCheckedLessons] = useState<Lesson[]>([]);

    useEffect(() => {
        dispatch(getLessons([{
            query: {
                module: params?.moduleId,
            }
        }]));
    });

    return (
        <>
            <LessonLayoutHeader
                breadcrumb={state.breadcrumb}
                onCreateLessonClick={() => createNewLessonDialogRef.current!.showModal()} />
            <section className="flex-1 flex flex-col space-y-4 px-2">
                <div className="flex space-x-2">
                    <div className="flex-1 flex">
                        <Search
                            placeholder="Search by name or description"
                            onSearch={
                                async (value) => {
                                    await dispatch(getLessons([{ query: { search: value } }]));
                                }
                            } />
                    </div>
                    {
                        checkedLessons.length > 0 && <ListAction actions={
                            [
                                {
                                    text: "Group",
                                    icon: <MdOutlineTag className="text-xl" />,
                                    onSelect() {
                                        // Todo
                                    },
                                },
                                {
                                    text: <span className="text-red-500">Delete</span>,
                                    icon: <MdOutlineDelete className="text-xl text-red-500" />,
                                    onSelect() {
                                        confirmDeleteDialogRef.current!.showModal()
                                    },
                                },
                            ]
                        } />
                    }
                </div>

                <LessonList
                    className="flex-1"
                    lessons={lessons}
                    loadingState={state.state}
                    onLessonChecked={setCheckedLessons}
                    loadMore={state.next ?
                        async () => {
                            await dispatch(getLessons([{ url: state.next!, }]));
                        }
                        : null
                    }
                    onEdit={async (Lesson, data) => {
                        const response = await Api.instance.lessonController.update({
                            path: Lesson.id,
                            data,
                        });

                        const newLesson = response.data;
                        dispatch(lessonActions.updateOne({
                            id: newLesson.id,
                            changes: newLesson,
                        }));

                        return newLesson;
                    }}
                    onDelete={async (Lesson) => {
                        await Api.instance.lessonController.remove({
                            path: Lesson.id,
                        });

                        dispatch(lessonActions.removeOne(Lesson.id));
                    }} />
            </section>
            {
                mounted && createPortal(
                    <CreateNewLessonDialog
                        ref={createNewLessonDialogRef}
                        onSave={async (data) => {
                            const response = await Api.instance.lessonController.create({
                                data: {
                                    ...data,
                                    module: params?.moduleId,
                                },
                            });

                            dispatch(lessonActions.addOne(response.data));
                        }} />,
                    document.body,
                )
            }

            {
                mounted && createPortal(
                    <ConfirmDeleteDialog
                        ref={confirmDeleteDialogRef}
                        onDelete={async () => {
                            confirmDeleteDialogRef.current!.close();
                            await toast.promise(
                                async () => {
                                    const ids = checkedLessons.map((course) => course.id);

                                    await Api.instance.lessonController.remove({
                                        path: "bulk-delete",
                                        query: {
                                            ids: ids.join(","),
                                        }
                                    });

                                    dispatch(lessonActions.removeMany(ids));
                                    setCheckedLessons([]);
                                },
                                {
                                    pending: "Deleting, please wait a moment...",
                                    success: "Lesson deleted successfully.",
                                    error: "An error occur, Try again!.",
                                }
                            );
                        }}>
                        <p className="text-lg font-medium">Do you want to delete lesson?</p>
                        <p className="mt-1 text-sm text-stone-700">This action is irreversible when initiated. All topics under this lesson will be deleted.</p>
                    </ConfirmDeleteDialog>,
                    document.body,
                )
            }
        </>
    );
}