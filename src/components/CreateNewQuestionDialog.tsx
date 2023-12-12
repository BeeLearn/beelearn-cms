import { isAxiosError, HttpStatusCode } from "axios";

import React, { useRef, useState, useCallback } from "react";
import { MdClose } from "react-icons/md";
import { toast, useToast } from "react-toastify";


import { Formik, Form } from "formik";
import { string, boolean, object, array, Schema } from "yup";

import { DialogElement } from "@/global";
import { ContentTypes, checkTypeQuestion, choiceTypeQuestion, textTypeQuestion } from "@/api/models/question.model";

import Dialog from "@/widgets/Dialog";
import { TextInput, TextAreaInput } from "@/widgets/TextInput";

import QuestionChoice, { Choice, emptyChoice } from "@/components/QuestionChoice";

import FormSubmitButton from "./FormSubmitButton";

type CreateNewQuestionDialogProps = {
    onSave: (value: Record<string, any>, questionType: keyof typeof ContentTypes) => Promise<void>,
};

export default React.forwardRef<Partial<DialogElement>, CreateNewQuestionDialogProps>(
    function CreateNewQuestionDialog({ onSave }, ref) {
        const dialogRef = useRef<DialogElement>(null);

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
            choices: object().shape({
                create: array().of(
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
                )
            }),
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

        const [questionType, setQuestionType] = useState<keyof typeof ContentTypes>("singlechoicequestion");

        return (
            <Dialog
                ref={dialogRef}
                overlayClassName="md:justify-right"
                className="fullscreen-dialog overflow-y-scroll">
                <Formik
                    validationSchema={validationSchemas[questionType]}
                    initialValues={{
                        title: "",
                        question: "",
                        choices: {
                            create: [emptyChoice(0), emptyChoice(1)],
                        },
                    }}
                    onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
                        try {
                            await onSave(values, questionType);
                            toast.success('Question created successfully');
                            resetForm();
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
                        ({ errors, touched, isSubmitting, resetForm, values }) => (
                            <>
                                <header className="flex items-center space-x-4 py-2">
                                    <MdClose
                                        className="text-xl text-stone-700 cursor-pointer"
                                        onClick={() => dialogRef.current!.close()} />
                                    <h1 className="flex-1 text-xl font-extrabold truncate">New Question</h1>
                                    <select
                                        value={questionType}
                                        className="btn bg-slate-100 !px-2"
                                        onChange={(event) => {
                                            setQuestionType(event.currentTarget.value as any);
                                            resetForm({ values });
                                        }}>
                                        {
                                            Object.entries(ContentTypes).map(([key, value], index) => (
                                                <option
                                                    key={index}
                                                    value={key}>{value}</option>
                                            ))
                                        }
                                    </select>
                                </header>
                                <Form className="flex-1 flex flex-col space-y-4">
                                    <div className="flex-1 flex flex-col space-y-4">
                                        <TextInput
                                            name="title"
                                            placeholder="Title"
                                            error={touched.title ? errors.title : null} />
                                        {
                                            textTypeQuestion.includes(questionType) && <div className="flex flex-col">
                                                <TextAreaInput
                                                    name="question"
                                                    placeholder="Question Script"
                                                    error={touched.question ? errors.question : null} />
                                                <p className="text-sm">
                                                    Scripts are <code>DragDrop</code>, <code>EditType</code> question types with custom syntax that are parsed by our lexer. For
                                                    <a
                                                        href="#"
                                                        className="text-violet-700"> More Information</a> on writing scripts.
                                                </p>
                                            </div>
                                        }
                                        {
                                            choiceTypeQuestion.includes(questionType) &&
                                            <QuestionChoice
                                                name="choices.create"
                                                checkType={
                                                    checkTypeQuestion.includes(questionType) ?
                                                        questionType == "multichoicequestion" ?
                                                            "checkbox" : "radio" :
                                                        undefined
                                                } />
                                        }
                                    </div>
                                    <FormSubmitButton
                                        text="Create Question"
                                        submitting={isSubmitting} />
                                </Form>
                            </>
                        )
                    }
                </Formik>
            </Dialog>
        );
    },
);