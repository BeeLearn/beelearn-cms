import { isAxiosError, HttpStatusCode } from "axios";

import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { Formik, Form } from "formik";
import { string, boolean, object, array, Schema } from "yup";

import type { DialogElement } from "@/global";
import { diffObject } from "@/lib/arrayHelper";
import Question, { ContentTypes, checkTypeQuestion, choiceTypeQuestion, textTypeQuestion } from "@/api/models/question.model";

import Dialog from "@/widgets/Dialog";
import { TextInput, TextAreaInput } from "@/widgets/TextInput";

import QuestionChoice from "@/components/QuestionChoice";

import FormSubmitButton from "./FormSubmitButton";

type CreateNewQuestionDialogProps = {
    question: Question,
    onDelete: (question: Question) => Promise<void>,
    onSave: (question: Question, value: Partial<Question>, contentType: string) => Promise<Question>,
};

export default React.forwardRef<Partial<DialogElement>, CreateNewQuestionDialogProps>(
    function CreateNewQuestionDialog({ question, onSave, onDelete }, ref) {
        const dialogRef = useRef<DialogElement>(null);
        const [isDeleting, setIsDeleting] = useState(false);

        React.useImperativeHandle(ref, () => {
            return {
                close: () => dialogRef.current!.close(),
                showModal: () => dialogRef.current!.showModal(),
            };
        }, []);

        const baseValidation = object().shape({
            title: string().required(),
            question: string().required(),
        });

        const selectableChoiceValidation = object().shape({
            title: string().required(),
            question: string(),
            choices: array().of(
                object().shape({
                    is_answer: boolean(),
                    name: string().required("This Field is required"),
                })
            ).test(
                "atLeastOneCheckedTest",
                "Require at least one choice to be checked",
                (value) => {
                    return value?.some(choice => choice.is_answer);
                }
            ),
        });


        const choiceValidation = object().shape({
            title: string().required(),
            choices: object().shape({
                create: array().of(
                    object().shape({
                        name: string().required("This Field is required"),
                    })
                )
            })
        });

        const validationSchemas: Record<keyof typeof ContentTypes, Schema> = {
            textoptionquestion: baseValidation,
            reorderchoicequestion: choiceValidation,
            dragdropquestion: object().shape({
                title: string().required(),
                question: string().required(),
                choices: object().shape({
                    create: array().of(
                        object().shape({
                            name: string().required("This Field is required"),
                        })
                    )
                }),
            }),
            singlechoicequestion: selectableChoiceValidation,
            multichoicequestion: selectableChoiceValidation,
        };

        return (
            <Dialog
                ref={dialogRef}
                overlayClassName="md:justify-right"
                className="fullscreen-dialog overflow-y-scroll">
                <Formik
                    validationSchema={validationSchemas[question.content_type]}
                    initialValues={question}
                    onSubmit={async (values, { resetForm, setSubmitting, setFieldError }) => {
                        try {
                            const newQuestion = await onSave(
                                question,
                                diffObject(question, values),
                                question.content_type
                            );

                            resetForm({ values: newQuestion });
                            toast.success("Question edited successfully");
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
                    }}>
                    {
                        ({ errors, isSubmitting }) => (
                            <>
                                <header className="flex items-center space-x-4 py-2">
                                    <MdClose
                                        className="text-xl text-stone-700 cursor-pointer"
                                        onClick={() => dialogRef.current!.close()} />
                                    <h1 className="flex-1 text-xl font-extrabold truncate">Edit Question</h1>
                                    <select
                                        value={question.content_type}
                                        disabled={true}
                                        className="btn bg-slate-100 !px-2">
                                        <option value={question.content_type}>{ContentTypes[question.content_type]}</option>
                                    </select>
                                </header>
                                <Form className="flex-1 flex flex-col space-y-4">
                                    <div className="flex-1 flex flex-col space-y-4">
                                        <TextInput
                                            name="title"
                                            placeholder="Title"
                                            error={errors.title} />
                                        {
                                            textTypeQuestion.includes(question.content_type) && <div className="flex flex-col">
                                                <TextAreaInput
                                                    name="question"
                                                    placeholder="Question Script"
                                                    error={errors.question} />
                                                <p className="text-sm">
                                                    Scripts are <code>DragDrop</code>, <code>EditType</code> question types with custom syntax that are parsed by our lexer. For
                                                    <a
                                                        href="#"
                                                        className="text-violet-700"> More Information</a> on writing scripts.
                                                </p>
                                            </div>
                                        }
                                        {
                                            choiceTypeQuestion.includes(question.content_type) &&
                                            <QuestionChoice
                                                name="choices"
                                                checkType={
                                                    checkTypeQuestion.includes(question.content_type) ?
                                                        question.content_type == "multichoicequestion" ?
                                                            "checkbox" : "radio" :
                                                        undefined
                                                } />
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
                                                    await onDelete(question);
                                                    toast.success("Question deleted successfully");
                                                }
                                                catch (error) {
                                                    toast.error("Can't delete question, try again!");
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
                                </Form>
                            </>
                        )
                    }
                </Formik>
            </Dialog>
        );
    },
);
