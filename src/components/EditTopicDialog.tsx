import { isAxiosError, HttpStatusCode } from "axios";

import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { MdAdd, MdClose, MdOutlineClose, MdQuestionMark } from "react-icons/md";

import { Formik, Form } from "formik";
import { boolean, object, string } from "yup";

import type { DialogElement } from "@/global";
import type Topic from "@/api/models/topic.model";
import type Question from "@/api/models/question.model";
import type TopicQuestion from "@/api/models/topicQuestion.model";

import useMounted from "@/composable/useMounted";


import Dialog from "@/widgets/Dialog";
import MarkdownEditor from "@/widgets/MarkdownEditor";
import { TextInput, TextAreaInput } from "@/widgets/TextInput";


import Api from "@/lib/api";
import { diffObject } from "@/lib/arrayHelper";

import { useAppDispatch } from "@/hooks";
import { questionActions } from "@/features/questionSlice";


import EditQuestionDialog from "./EditQuestionDialog";
import FormSubmitButton from "./FormSubmitButton";
import CreateNewQuestionDialog from "./CreateNewQuestionDialog";


type CreateNewTopicDialogProps = {
    topic: Topic,
    onDelete: (topic: Topic) => Promise<void>,
    onSave: (topic: Topic, value: Record<string, any>) => Promise<Topic>,
}

export default forwardRef<Partial<DialogElement>, CreateNewTopicDialogProps>(
    function CreateNewTopicDialog({ topic, onSave, onDelete }, ref) {
        const mounted = useMounted();

        const dialogRef = useRef<DialogElement>(null);
        const editQuestionDialogRef = useRef<DialogElement>(null);
        const createNewQuestionDialogRef = useRef<DialogElement>(null);

        const [isDeleting, setIsDeleting] = useState(false);
        const [selectedTopicQuestion, setSelectedTopicQuestion] = useState<TopicQuestion | null>(null);

        const dispatch = useAppDispatch();

        useImperativeHandle(ref, () => {
            return {
                close: () => dialogRef.current!.close(),
                showModal: () => dialogRef.current!.showModal(),
            };
        }, []);

        return (
            <Dialog
                ref={dialogRef}
                overlayClassName="md:justify-right"
                className="w-full h-full bg-white md:w-1/2 lg:w-4/10 md:h-full md:rounded-none">
                <header className="flex items-center space-x-4 py-2">
                    <button onClick={() => dialogRef.current!.close()}>
                        <MdClose className="text-xl text-stone-700 cursor-pointer" />
                    </button>
                    <h1 className="flex-1 text-xl font-extrabold">New Topic</h1>
                </header>
                <Formik
                    validationSchema={
                        object().shape({
                            title: string().required(),
                            description: string().notRequired(),
                            content: string().required(),
                            is_visible: boolean().required(),
                        })
                    }
                    initialValues={topic}
                    onSubmit={
                        async (values, { setSubmitting, setFieldError, resetForm }) => {
                            try {
                                const newTopic = await onSave(topic, diffObject(topic, values));

                                resetForm({ values: newTopic });
                                toast.success("Topic edited successfully!");
                            } catch (error) {
                                if (isAxiosError(error) && error.response?.status === HttpStatusCode.BadRequest) {
                                    const response = error.response;
                                    const data = response.data;

                                    for (let [field, value] of Object.entries(data)) {
                                        setFieldError(field, Array.isArray(value) ? value.join(". ") : value as string);
                                    }
                                }

                                toast.error("An unexpected error occurred, Try again!");
                            }
                            finally {
                                setSubmitting(false);
                            }
                        }
                    }>
                    {
                        ({ values, errors, touched, isSubmitting, setFieldValue }) => (
                            <Form className="flex-1 flex flex-col space-y-4">
                                <div className="flex-1 flex flex-col space-y-4">
                                    <TextInput
                                        name="title"
                                        placeholder="Title"
                                        error={touched.title ? errors.title : null} />
                                    <TextAreaInput
                                        name="description"
                                        placeholder="Description"
                                        error={touched.description ? errors.description : null} />
                                    <MarkdownEditor
                                        value={topic.content}
                                        onChange={
                                            (value) => setFieldValue("content", value)
                                        }
                                        error={touched.content ? errors.content : null} />
                                    <button
                                        type="button"
                                        className="btn border-1 border-violet border-style-dashed text-violet-700"
                                        onClick={() => {
                                            createNewQuestionDialogRef.current!.showModal();
                                        }}>
                                        <MdAdd className="text-xl" />
                                        <span>Add Question</span>
                                    </button>
                                    {
                                        values.topic_questions.map((topic_question, index) => (
                                            <div
                                                key={index}
                                                className="flex btn border border-gray-400 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        setSelectedTopicQuestion(topic_question);
                                                        setTimeout(() => editQuestionDialogRef.current!.showModal());
                                                    }
                                                }>
                                                <MdQuestionMark className="text-lg text-violet-700" />
                                                <p className="flex-1">{topic_question.question.title}</p>
                                                <button
                                                    onClick={
                                                        (event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();

                                                            setFieldValue(
                                                                "topic_questions",
                                                                values.topic_questions.filter(element => element !== topic_question)
                                                            );
                                                        }
                                                    }>
                                                    <MdOutlineClose className="text-lg" />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="flex space-x-4">
                                    <FormSubmitButton
                                        text="Delete"
                                        className="flex-1 border-2 text-red-500"
                                        submitting={isDeleting}
                                        onClick={async () => {
                                            setIsDeleting(true);
                                            try {
                                                await onDelete(topic);
                                                toast.success("Topic deleted successfully");
                                            }
                                            catch (error) {
                                                toast.error("Can't delete topic, try again!");
                                            } finally {
                                                setIsDeleting(false);
                                            }
                                            dialogRef.current!.close();
                                        }} />
                                    <FormSubmitButton
                                        text="Save"
                                        className="flex-1 btn btn-primary"
                                        submitting={isSubmitting} />
                                </div>
                                {
                                    mounted && createPortal(
                                        <CreateNewQuestionDialog
                                            ref={createNewQuestionDialogRef}
                                            onSave={async (data, questionType) => {
                                                setFieldValue("topic_questions",
                                                    values.topic_questions.concat({
                                                        question: data,
                                                        question_content_type: questionType,
                                                    } as any)
                                                );
                                                createNewQuestionDialogRef.current!.close();
                                            }} />,
                                        document.body,
                                    )
                                }
                                {
                                    mounted && selectedTopicQuestion && createPortal(
                                        <EditQuestionDialog
                                            ref={editQuestionDialogRef}
                                            question={selectedTopicQuestion.question as unknown as Question}
                                            onDelete={async (question) => {
                                                const topicQuestions = values.topic_questions.filter(element => element.question.id !== question.id);

                                                setFieldValue("topic_questions", topicQuestions);
                                                editQuestionDialogRef.current!.close();
                                            }}
                                            onSave={async (question, data) => {
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


                                                editQuestionDialogRef.current!.close();

                                                return newQuestion;
                                            }} />,
                                        document.body,
                                    )
                                }
                            </Form>
                        )
                    }
                </Formik>
            </Dialog>
        );
    },
);
