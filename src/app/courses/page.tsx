"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdOutlineDelete, MdOutlineTag } from "react-icons/md";

import { toast } from "react-toastify";


import Api from "@/lib/api";
import Course from "@/api/models/course.model";

import useMounted from "@/composable/useMounted";
import { courseActions, courseSelector, getCourses } from "@/features/courseSlice";

import type { DialogElement } from "@/global";

import Search from "@/components/Search";
import ListAction from "@/components/ListAction";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import CreateNewCourseDialog from "@/components/CreateNewCourseDialog";

import CourseList from "./components/CourseList";
import LayoutHeader from "./components/LayoutHeader";
import { useAppDispatch, useAppSelector } from "../hooks";

export default function CoursePage() {
    const mounted = useMounted();
    const confirmDeleteDialogRef = useRef<DialogElement>(null);
    const createNewCourseDialogRef = useRef<DialogElement>(null);

    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.course);
    const courses = courseSelector.selectAll(state);

    const [checkedCourses, setCheckedCourses] = useState<Course[]>([]);

    useEffect(() => {
        dispatch(getCourses([]));
    }, [dispatch]);

    return (
        <>
            <LayoutHeader
                onCreateClick={() => createNewCourseDialogRef.current!.showModal()} />
            <section className="flex-1 flex flex-col space-y-4 px-2">
                <div className="flex space-x-2">
                    <div className="flex-1 flex">
                        <Search
                            placeholder="Search by name or description"
                            onSearch={
                                async (value) => {
                                    await dispatch(getCourses([{ query: { search: value } }]));
                                }
                            } />
                    </div>
                    {
                        checkedCourses.length > 0 && <ListAction actions={
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

                <CourseList
                    courses={courses}
                    className="flex-1"
                    loadingState={state.state}
                    onCourseChecked={setCheckedCourses}
                    loadMore={
                        state.next ?
                            async () => {
                                await dispatch(getCourses([{ url: state.next! }]));
                            } : null
                    }
                    onEdit={async (course, data, multipart) => {
                        const response = await Api.instance.courseController.update({
                            path: course.id,
                            data,
                        }, multipart);

                        const newCourse = response.data;
                        dispatch(courseActions.updateOne({
                            id: newCourse.id,
                            changes: newCourse,
                        }));

                        return newCourse;
                    }}
                    onDelete={async (course) => {
                        await Api.instance.courseController.remove({
                            path: course.id,
                        });

                        dispatch(courseActions.removeOne(course.id));
                    }} />
            </section>
            {
                mounted && createPortal(
                    <CreateNewCourseDialog
                        ref={createNewCourseDialogRef}
                        onSave={async (data) => {
                            const response = await Api.instance.courseController.create({ data });
                            dispatch(courseActions.addOne(response.data));
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
                                    const ids = checkedCourses.map((course) => course.id);

                                    await Api.instance.courseController.remove({
                                        path: "bulk-delete",
                                        query: {
                                            ids: ids.join(","),
                                        }
                                    });

                                    dispatch(courseActions.removeMany(ids));
                                    setCheckedCourses([]);
                                },
                                {
                                    pending: "Deleting, please wait a moment...",
                                    success: "Courses deleted successfully.",
                                    error: "An error occur, Try again!.",
                                }
                            );
                        }}>
                        <p className="text-lg font-medium">Do you want to delete courses?</p>
                        <p className="mt-1 text-sm text-stone-700">This action is irreversible when initiated. Make sure you select the correct courses.</p>
                    </ConfirmDeleteDialog>,
                    document.body,
                )
            }
        </>
    );
}
