"use client";
import { useRouter } from "next/navigation";

import { Fragment } from "react";
import { MdAdd, MdChevronRight } from "react-icons/md";

import MenuButton from "@/components/MenuButton";
import { LessonBreadCrumb } from "@/api/models/lesson.model";

type LayoutHeaderProps = {
    breadcrumb?: LessonBreadCrumb,
    onCreateLessonClick: () => void,
}

export default function LayoutHeader({ breadcrumb, onCreateLessonClick }: LayoutHeaderProps) {
    const router = useRouter();

    return (
        <header className="flex flex-col space-y-2 p-4">
            <div className="flex space-x-4 md:space-x-0">
                <MenuButton />
                <div className="flex-1">
                    <h1 className="text-xl font-extrabold">Lessons</h1>
                </div>
                <div>
                    <button
                        className="btn btn-success truncate"
                        onClick={onCreateLessonClick}>
                        <MdAdd className="text-xl" />
                        <span>New Lesson</span>
                    </button>
                </div>
            </div>
            <div className="flex space-x-2 items-center overflow-x-scroll">
                {
                    breadcrumb && Object.entries(breadcrumb).map(([key, value]) => (
                        <Fragment key={key}>
                            <button
                                className="text-violet-700 text-nowrap"
                                onClick={() => {
                                    switch (key) {
                                        case "course":
                                            router.push(`/courses/`);
                                            break;
                                        case "module":
                                            router.push(`/courses/${breadcrumb.course.id}/modules/`);
                                            break;
                                    }
                                }}>{value.name}</button>
                            <div>
                                <MdChevronRight className="text-xl text-stone-500" />
                            </div>
                        </Fragment>
                    ))
                }
                <span>Lessons</span>
            </div>
        </header>
    );
}