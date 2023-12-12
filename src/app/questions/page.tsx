"use client";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useRef, useEffect, useState } from "react";
import { MdOutlineTag, MdOutlineDelete } from "react-icons/md";

import Api from "@/lib/api";
import Question from "@/api/models/question.model";

import { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";
import { deleteQuestions, getQuestions, listQuestions, questionActions, questionSelector, transformPagination } from "@/features/questionSlice";


import Search from "@/components/Search";
import ListAction from "@/components/ListAction";
import type { Choice } from "@/components/QuestionChoice";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import CreateNewQuestionDialog from "@/components/CreateNewQuestionDialog";

import { useAppDispatch, useAppSelector } from "../hooks";
import LayoutHeader from "./components/LayoutHeader";
import QuestionList from "./components/QuestionList";


export default function QuestionsPage() {
    const mounted = useMounted();
    const confirmDeleteDialogRef = useRef<DialogElement>(null);
    const createNewQuestionDialogRef = useRef<DialogElement>(null);

    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.question);
    const questions = questionSelector.selectAll(state);

    const [checkedQuestions, setCheckedQuestions] = useState<Question[]>([]);

    useEffect(() => {
        dispatch(getQuestions({}));
    });

    return (
        <>
            <LayoutHeader
                onCreateQuestionClick={() => createNewQuestionDialogRef.current!.showModal()} />
            <section className="flex-1 flex flex-col space-y-4 px-4">
                <div className="flex space-x-2">
                    <div className="flex-1 flex">
                        <Search
                            placeholder="Search by name or description"
                            onSearch={
                                async (value) => {
                                    await dispatch(getQuestions({ query: { search: value } }));
                                }
                            } />
                    </div>
                    {
                        checkedQuestions.length > 0 && <ListAction actions={
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

                <QuestionList
                    className="flex-1"
                    questions={questions}
                    loadingState={state.state}
                    onQuestionChecked={setCheckedQuestions}
                    loadMore={
                        state.paginate.some(state => state.next) ? async () => {
                            const urls = [];

                            for (const paginate of state.paginate) {
                                if (paginate.next) {
                                    urls.push(paginate.next);
                                }
                            }

                            const payload = await listQuestions({ urls });
                            dispatch(questionActions.setPaginate(transformPagination(payload)));
                            dispatch(questionActions.addMany(payload.flatMap(data => data.results)));
                        } : null
                    }
                    onEdit={async (question, data) => {
                        const response = await Api.instance.questionController.update({
                            path: question.id,
                            data,
                            query: {
                                content_type: question.content_type,
                            },
                        });

                        const newQuestion = response.data;
                        dispatch(questionActions.updateOne({
                            id: newQuestion.id,
                            changes: newQuestion,
                        }));

                        return newQuestion;
                    }}
                    onDelete={async (question) => {
                        await Api.instance.questionController.remove({
                            path: question.id,
                        });

                        dispatch(questionActions.removeOne(question.id));
                    }} />
            </section>
            {
                mounted && createPortal(
                    <CreateNewQuestionDialog
                        ref={createNewQuestionDialogRef}
                        onSave={async (data, questionType) => {
                            const response = await Api.instance.questionController.create({
                                data,
                                query: {
                                    content_type: questionType,
                                }
                            });

                            dispatch(questionActions.addOne(response.data));
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
                                    const ids = await deleteQuestions(checkedQuestions);
                                    console.log(ids);
                                    dispatch(questionActions.removeMany(ids));
                                    //setCheckedQuestions([]);
                                    toast.success("New course created successfully!");
                                },
                                {
                                    pending: "Deleting, please wait a moment...",
                                    success: "Questions deleted successfully.",
                                    error: "An error occur, Try again!.",
                                }
                            );
                        }}>
                        <p className="text-lg font-medium">Do you want to delete questions?</p>
                        <p className="mt-1 text-sm text-stone-700">This action is irreversible when initiated. Make sure you select the correct questions.</p>
                    </ConfirmDeleteDialog>,
                    document.body,
                )
            }
        </>
    );
}
