"use client";
import Image from "next/image";

import { createPortal } from "react-dom";
import React, { useState, useRef } from "react";

import { toast } from "react-toastify";

import Course from "@/api/models/course.model";

import { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";
import { PropsWithClassName, join } from "@/props";
import { LoadingState } from "@/features/features";

import Empty from "@/assets/empty.svg";

import LoadMore from "@/components/LoadMore";
import EditCourseDialog from "@/components/EditCourseDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

import TableSortLabel from "@/widgets/TableSortLabel";

import CourseListItem from "./CourseListItem";

type CourseListProps = {
  courses: Course[];
  loadingState: LoadingState["state"];
  loadMore?: (() => Promise<void>) | null;
  onCourseChecked: (courses: Array<Course>) => void;
  onDelete: (course: Course) => Promise<void>;
  onEdit: (
    course: Course,
    data: Partial<Course>,
    multipart: boolean
  ) => Promise<Course>;
} & PropsWithClassName;

export default function CourseList({
  className,
  courses,
  loadingState,
  loadMore,
  onCourseChecked,
  onEdit,
  onDelete,
}: CourseListProps) {
  const mounted = useMounted();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [checkedCourses, setCheckedCourses] = useState(new Set<Course>());

  const editCourseDialogRef = useRef<DialogElement>(null);
  const confirmDeleteDialogRef = useRef<DialogElement>(null);

  const confirmDelete = async function (course: Course) {
    setSelectedCourse(course);
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
                    setCheckedCourses(new Set(courses));
                    onCourseChecked(courses);
                  } else {
                    setCheckedCourses(new Set());
                    onCourseChecked([]);
                  }
                }}
              />
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
          {loadingState == "success" &&
            courses.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                isChecked={checkedCourses.has(course)}
                onEditClick={async (course) => {
                  setSelectedCourse(course);
                  setTimeout(() => editCourseDialogRef.current!.showModal());
                }}
                onDeleteClick={confirmDelete}
                onChecked={(checked, course) => {
                  if (checked) {
                    checkedCourses.add(course);
                    onCourseChecked(Array.from(checkedCourses.values()));
                    setCheckedCourses(new Set(checkedCourses));
                  } else {
                    checkedCourses.delete(course);
                    onCourseChecked(Array.from(checkedCourses.values()));
                    setCheckedCourses(new Set(checkedCourses));
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
        courses.length === 0 && (
          <div className="flex-1 flex flex-col space-y-2 justify-center items-center">
            <Image src={Empty} alt="Empty courses" className="w-24 h-24" />
            <div className="text-center">
              <h1 className="text-xl font-medium">No course yet!</h1>
              <p className="text-stone-700">
                Created courses will be founded here when added.
              </p>
            </div>
          </div>
        )
      )}

      {loadMore && <LoadMore onClick={loadMore} />}

      {mounted &&
        selectedCourse &&
        createPortal(
          <EditCourseDialog
            course={selectedCourse}
            ref={editCourseDialogRef}
            onSave={onEdit}
            onDelete={async (course) => {
              confirmDelete(course);
              confirmDeleteDialogRef.current!.addListener(
                "delete",
                function () {
                  editCourseDialogRef.current!.close();
                }
              );
            }}
          />,
          document.body
        )}
      {mounted &&
        selectedCourse &&
        createPortal(
          <ConfirmDeleteDialog
            ref={confirmDeleteDialogRef}
            onDelete={async () => {
              await toast.promise(onDelete(selectedCourse), {
                pending: "Deleting course",
                success: "Course deleted",
                error: "An unexected error occur, try again!",
              });
            }}
          >
            <h1 className="text-2xl font-bold">
              Do you want to delete course?
            </h1>
            <p className="text-stone-700">
              Course will be deleted. Modules, lessons and topics under this
              course will be deleted permanently. Do you still want to perform
              this action?
            </p>
          </ConfirmDeleteDialog>,
          document.body
        )}
    </div>
  );
}

