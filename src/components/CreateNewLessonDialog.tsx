import React from "react";
import { MdClose } from "react-icons/md";

import { object, string } from "yup";
import { Formik, Form } from "formik";

import type { DialogElement } from "@/global";
import Lesson from "@/api/models/lesson.model";

import Dialog from "@/widgets/Dialog";
import { TextInput, TextAreaInput } from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";
import { isAxiosError, HttpStatusCode } from "axios";
import { toast } from "react-toastify";

export type CreateLesson = Pick<Lesson, "name" | "description" | "is_visible">;

type CreateNewLessonDialogProps = {
    onSave: (value: CreateLesson) => Promise<void>,
};

export default React.forwardRef<Partial<DialogElement>, CreateNewLessonDialogProps>(
    function CreateNewLessonDialog({ onSave }, ref) {
        const dialogRef = React.useRef<DialogElement>(null);

        React.useImperativeHandle(ref, () => {
            return {
                close: () => dialogRef.current!.close(),
                showModal: () => dialogRef.current!.showModal(),
            };
        }, []);

        return (
            <Dialog
                ref={dialogRef}
                overlayClassName="md:justify-right"
                className="w-full h-full bg-white md:w-1/2 lg:w-1/3 md:h-full md:rounded-none">
                <header className="flex items-center space-x-4 py-2">
                    <MdClose
                        className="text-xl text-stone-700 cursor-pointer"
                        onClick={() => dialogRef.current!.close()} />
                    <h1 className="flex-1 text-xl font-extrabold">New Lesson</h1>
                </header>
                <Formik
                    validationSchema={
                        object().shape({
                        name: string().required(),
                        description: string().notRequired(),
                    })}
                    initialValues={{
                        name: "",
                        description: "",
                        is_visible: true,
                    }}
                    onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
                        try {
                            await onSave(values);

                            resetForm();
                            toast.success("New lesson created successfully.");
                        } catch (error) {
                            if (isAxiosError(error) && error.response?.status === HttpStatusCode.BadRequest) {
                                const response = error.response;
                                const data = response.data;

                                for (let [field, value] of Object.entries(data)) {
                                    setFieldError(field, Array.isArray(value) ? value.join(".") : value as string);
                                }
                            }


                            toast.error("An unexpected error occurred, Try again!");
                        }
                        finally {
                            setSubmitting(false);
                        }
                    }}>
                    {
                        ({ errors, touched, isSubmitting }) => (
                            <Form className="flex-1 flex flex-col">
                                <div className="flex-1 flex flex-col space-y-4">
                                    <TextInput
                                        name="name"
                                        placeholder="Lesson name"
                                        error={touched.name ? errors.name : null} />
                                    <TextAreaInput
                                        name="description"
                                        placeholder="Description"
                                        error={touched.description ? errors.description : null} />
                                </div>
                                <FormSubmitButton
                                    text="Create Lesson"
                                    submitting={isSubmitting} />
                            </Form>
                        )
                    }
                </Formik>
            </Dialog>
        );
    },
);