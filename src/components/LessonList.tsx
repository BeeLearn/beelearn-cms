"use client";
import Image from "next/image";

import { createPortal } from "react-dom";
import React, { useRef, useState } from "react";

import { toast } from "react-toastify";

import Lesson from "@/api/models/lesson.model";

import { join, type PropsWithClassName } from "@/props";
import type { LoadingState } from "@/features/features";

import Empty from "@/assets/empty.svg";
import TableSortLabel from "@/widgets/TableSortLabel";

import { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";

import LoadMore from "@/components/LoadMore";
import EditLessonDialog from "@/components/EditLessonDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

import LessonListItem from "./LessonListItem";

type LessonListProps = {
  lessons: Lesson[];
  loadingState: LoadingState["state"];
  loadMore?: (() => Promise<void>) | null;
  onLessonChecked: (Lessons: Array<Lesson>) => void;
  onDelete: (lesson: Lesson) => Promise<void>;
  onEdit: (lesson: Lesson, data: Partial<Lesson>) => Promise<Lesson>;
} & PropsWithClassName;

export default function LessonList({
  className,
  lessons,
  loadingState,
  loadMore,
  onLessonChecked,
  onEdit,
  onDelete,
}: LessonListProps) {
  const mounted = useMounted();

  const [checkedLessons, setCheckedLessons] = useState(new Set<Lesson>());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const editLessonDialogRef = useRef<DialogElement>(null);
  const confirmDeleteDialogRef = useRef<DialogElement>(null);

  const confirmDelete = async function (lesson: Lesson) {
    setSelectedLesson(lesson);
    setTimeout(() => confirmDeleteDialogRef.current!.showModal());
  };

  return (
    <div className={join("table-container flex flex-col", className)}>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(event) => {
                  const checked = event.currentTarget.checked;

                  if (checked) {
                    setCheckedLessons(new Set(lessons));
                    onLessonChecked(lessons);
                  } else {
                    setCheckedLessons(new Set());
                    onLessonChecked([]);
                  }
                }}
              />
            </th>
            <th>Name</th>
            <th>Is visible</th>
            <TableSortLabel>Created At</TableSortLabel>
            <TableSortLabel>Updated At</TableSortLabel>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loadingState == "success" &&
            lessons.map((lesson) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                isChecked={checkedLessons.has(lesson)}
                onEditClick={async (lesson) => {
                  setSelectedLesson(lesson);
                  setTimeout(() => editLessonDialogRef.current!.showModal());
                }}
                onDeleteClick={confirmDelete}
                onChecked={(checked, lesson) => {
                  if (checked) {
                    checkedLessons.add(lesson);
                    onLessonChecked(Array.from(checkedLessons.values()));
                    setCheckedLessons(new Set(checkedLessons));
                  } else {
                    checkedLessons.delete(lesson);
                    onLessonChecked(Array.from(checkedLessons.values()));
                    setCheckedLessons(new Set(checkedLessons));
                  }
                }}
              />
            ))}
        </tbody>
      </table>
      {loadingState == "idle" || loadingState == "pending" ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="s-8 progress progress-primary" />
        </div>
      ) : (
        lessons.length === 0 && (
          <div className="flex-1 flex flex-col space-y-2 justify-center items-center">
            <Image src={Empty} alt="Empty Lessons" className="w-24 h-24" />
            <div className="text-center">
              <h1 className="text-xl font-medium">No lesson yet!</h1>
              <p className="text-stone-700">
                Created lessons will be founded here when added.
              </p>
            </div>
          </div>
        )
      )}

      {loadMore && <LoadMore onClick={loadMore} />}
      {mounted &&
        selectedLesson &&
        createPortal(
          <EditLessonDialog
            lesson={selectedLesson}
            ref={editLessonDialogRef}
            onSave={onEdit}
            onDelete={async (module) => {
              confirmDelete(module);
              confirmDeleteDialogRef.current.addListener("delete", () => {
                editLessonDialogRef.current!.close();
              });
            }}
          />,
          document.body
        )}
      {mounted &&
        selectedLesson &&
        createPortal(
          <ConfirmDeleteDialog
            ref={confirmDeleteDialogRef}
            onDelete={async () => {
              await toast.promise(() => onDelete(selectedLesson), {
                pending: "Deleting lesson",
                success: "Lesson deleted",
                error: "An error occur, try again!",
              });
            }}
          >
            <h1 className="text-2xl font-bold">
              Do you want to delete lesson?
            </h1>
            <p className="text-stone-700">
              Topics under this lesson will be deleted permanently. Do you still
              want to perform this action?
            </p>
          </ConfirmDeleteDialog>,
          document.body
        )}
    </div>
  );
}

