import { isAxiosError, HttpStatusCode } from "axios";

import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { MdAdd, MdClose, MdOutlineClose, MdQuestionMark } from "react-icons/md";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { object, string } from "yup";
import { Formik, Form } from "formik";

import { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";

import Dialog from "@/widgets/Dialog";
import MarkdownEditor from "@/widgets/MarkdownEditor";
import { TextInput, TextAreaInput } from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";

import { Choice } from "./QuestionChoice";
import CreateNewQuestionDialog from "./CreateNewQuestionDialog";
import MDEditor from "@uiw/react-md-editor";

type CreateNewTopicDialogProps = {
    onSave: (value: Record<string, any>) => Promise<void>,
}

export default forwardRef<Partial<DialogElement>, CreateNewTopicDialogProps>(
    function CreateNewTopicDialog({ onSave }, ref) {
        const mounted = useMounted();

        const dialogRef = useRef<DialogElement>(null);
        const createNewQuestionDialogRef = useRef<DialogElement>(null);

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
                        })
                    }
                    initialValues={
                        {
                            title: "",
                            description: "",
                            content: "",
                            visible: true,
                            topic_questions: {
                                create: [] as Record<string, any>[]
                            },
                        }
                    }
                    onSubmit={
                        async (values, { setSubmitting, setFieldError, resetForm }) => {
                            try {
                                await onSave(values);

                                resetForm();
                                toast.success("New topic created successfully!");
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
                    }
                    onReset={() =>{
                        const editors = document.querySelectorAll<HTMLTextAreaElement>(".w-md-editor-text-input");
                        for(const editor of editors){
                            editor.value = ""
                            editor.innerText = ""
                        }
                    }}>
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
                                        values.topic_questions.create.map((question, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                className="flex btn border border-gray-400"
                                                onClick={() => {
                                                    setFieldValue(
                                                        "topic_questions.create",
                                                        values.topic_questions.create.filter(element => element !== question)
                                                    );
                                                }}>
                                                <MdQuestionMark className="text-lg text-violet-700" />
                                                <p className="flex-1">{question.question.title}</p>
                                                <MdOutlineClose className="text-lg" />
                                            </button>
                                        ))
                                    }
                                </div>
                                <FormSubmitButton
                                    text="Create Topic"
                                    submitting={isSubmitting} />
                                {
                                    mounted && createPortal(
                                        <CreateNewQuestionDialog
                                            ref={createNewQuestionDialogRef}
                                            onSave={async (data, questionType) => {
                                                setFieldValue("topic_questions.create",
                                                    values.topic_questions.create.concat({
                                                        question: data,
                                                        question_content_type: questionType,
                                                    })
                                                );
                                                createNewQuestionDialogRef.current!.close();
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
