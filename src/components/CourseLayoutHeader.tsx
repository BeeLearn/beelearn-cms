import React from "react";
import { MdAdd } from "react-icons/md";

import MenuButton from "@/components/MenuButton";
import { PropsWithClassName, join } from "@/props";

type LayoutHeaderProps = {
    onCreateClick: () => void,
} & PropsWithClassName;

export default function LayoutHeader({ onCreateClick, className }: LayoutHeaderProps) {
    return (
        <header className={join("flex items-center space-x-2 p-4", className)}>
            <MenuButton />
            <h1 className="flex-1 text-2xl font-extrabold">Courses</h1>
            <button
                className="btn btn-success"
                onClick={onCreateClick}>
                <MdAdd className="text-lg" />
                <div> New Course</div>
            </button>
        </header>
    )
}