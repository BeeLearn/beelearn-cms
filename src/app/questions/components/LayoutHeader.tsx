"use client";
import { MdAdd } from "react-icons/md";

import MenuButton from "@/components/MenuButton";

type LayoutHeaderProps = {
    onCreateQuestionClick: () => void,
};

export default function LayoutHeader({ onCreateQuestionClick }: LayoutHeaderProps) {
    return (
        <header className="flex space-x-2 items-center p-4">
            <MenuButton />
            <h1 className="flex-1 text-xl font-extrabold">Questions</h1>
            <button
                className="btn btn-success"
                onClick={onCreateQuestionClick}>
                    <MdAdd className="text-xl" />
                    <span>New Question</span>
                </button>
        </header>
    );
}