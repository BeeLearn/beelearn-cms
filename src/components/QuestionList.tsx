"use client";

import Image from "next/image";

import React, { useRef, useState } from "react";

import Question from "@/api/models/question.model";

import { join, type PropsWithClassName } from "@/props";
import type { LoadingState } from "@/features/features";

import Empty from "@/assets/trophy.svg";

import LoadMore from "@/components/LoadMore";
import TableSortLabel from "@/widgets/TableSortLabel";

import QuestionListItem from "./QuestionListItem";
import useMounted from "@/composable/useMounted";
import { DialogElement } from "@/global";
import EditQuestionDialog from "@/components/EditQuestionDialog";
import { createPortal } from "react-dom";

type QuestionListProps = {
  questions: Question[];
  loadingState: LoadingState["state"];
  loadMore?: (() => Promise<void>) | null;
  onQuestionChecked: (questions: Array<Question>) => void;
  onDelete: (question: Question) => Promise<void>;
  onEdit: (question: Question, data: Partial<Question>) => Promise<Question>;
} & PropsWithClassName;

export default function QuestionList({
  className,
  questions,
  loadingState,
  loadMore,
  onEdit,
  onDelete,
  onQuestionChecked,
}: QuestionListProps) {
  const mounted = useMounted();

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  const [checkedQuestions, setCheckedQuestions] = useState(new Set<Question>());

  const editQuestionDialogRef = useRef<DialogElement>(null);
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
                    setCheckedQuestions(new Set(questions));
                    onQuestionChecked(questions);
                  } else {
                    setCheckedQuestions(new Set());
                    onQuestionChecked([]);
                  }
                }}
              />
            </th>
            <th>Name</th>
            <th>Has Choices</th>
            <TableSortLabel>Created At</TableSortLabel>
            <TableSortLabel>Updated At</TableSortLabel>
          </tr>
        </thead>
        <tbody>
          {loadingState == "success" &&
            questions.map((question) => (
              <QuestionListItem
                key={question.created_at}
                question={question}
                isChecked={checkedQuestions.has(question)}
                onEditClick={async (course) => {
                  setSelectedQuestion(course);
                  setTimeout(() => editQuestionDialogRef.current!.showModal());
                }}
                onDeleteClick={onDelete}
                onChecked={(checked, question) => {
                  if (checked) {
                    checkedQuestions.add(question);
                    onQuestionChecked(Array.from(checkedQuestions.values()));
                    setCheckedQuestions(new Set(checkedQuestions));
                  } else {
                    checkedQuestions.delete(question);
                    onQuestionChecked(Array.from(checkedQuestions.values()));
                    setCheckedQuestions(new Set(checkedQuestions));
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
        questions.length === 0 && (
          <div className="flex-1 flex flex-col space-y-2 justify-center items-center">
            <Image src={Empty} alt="Empty " className="w-24 h-24" />
            <div className="text-center">
              <h1 className="text-xl font-medium">No question yet!</h1>
              <p className="text-stone-700">
                Created question will be founded here when added.
              </p>
            </div>
          </div>
        )
      )}

      {loadMore && <LoadMore onClick={loadMore} />}
      {mounted &&
        selectedQuestion &&
        createPortal(
          <EditQuestionDialog
            question={selectedQuestion}
            ref={editQuestionDialogRef}
            onSave={onEdit}
            onDelete={onDelete}
          />,
          document.body
        )}
    </div>
  );
}

