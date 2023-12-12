import { isAxiosError, HttpStatusCode } from "axios";

import { MdCheck, MdClose, MdSearch, MdTag } from "react-icons/md";
import { toast } from "react-toastify";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";


import { Formik, Form } from "formik";
import { string, object } from "yup";

import { DialogElement } from "@/global";
import Course from "@/api/models/course.model";

import Dialog from "@/widgets/Dialog";
import ChipInput from "@/widgets/ChipInput";
import { TextInput, TextAreaInput, FileInput } from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";
import Api from "@/lib/api";
import Tag from "@/api/models/tag.model";
import { LoadingState } from "@/features/features";

export type CreateCourse = NonNullable<Pick<Course, "name" | "description">>;

type CreateNewCourseDialogProps = {
    onSave: (data: CreateCourse) => Promise<void>,
};

export default forwardRef<Partial<DialogElement>, CreateNewCourseDialogProps>(
    function CreateNewCourseDialog({ onSave }, ref) {
        const fileRef = useRef<any>(null);
        const dialogRef = useRef<DialogElement>(null);

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
                className="fullscreen-dialog">
                <header className="flex items-center space-x-4 py-2">
                    <MdClose
                        className="text-xl text-stone-700 cursor-pointer"
                        onClick={() => dialogRef.current!.close()} />
                    <h1 className="flex-1 text-xl font-extrabold">Add a New Course</h1>
                </header>
                <Formik
                    validationSchema={
                        object().shape({
                            illustration: string().required(),
                            name: string().trim().required(),
                            description: string().trim().max(128).required(),
                        })
                    }
                    initialValues={{
                        name: "",
                        description: "",
                        illustration: "",
                    }}
                    onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
                        try {
                            await onSave(values);
                            resetForm();
                            toast.success("New course created successfully.");
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
                    }}
                    onReset={() => {
                        fileRef.current!.reset();
                    }}>
                    {
                        ({ errors, touched, isSubmitting, values, setFieldValue }) => (
                            <Form
                                className="flex-1 flex flex-col overflow-y-scroll">
                                <div className="flex-1 flex flex-col space-y-4">
                                    <FileInput
                                        ref={fileRef}
                                        name="illustration"
                                        text="Add Course Illustration"
                                        accept="image/*"
                                        error={touched.illustration ? errors.illustration : null} />
                                    <TextInput
                                        name="name"
                                        placeholder="Course Name"
                                        error={touched.name ? errors.name : null} />
                                    <TextAreaInput
                                        name="description"
                                        placeholder="Course Description"
                                        error={touched.description ? errors.description : null} />
                                </div>
                                <FormSubmitButton
                                    text="Create Course"
                                    submitting={isSubmitting} />
                            </Form>
                        )
                    }
                </Formik>
            </Dialog >
        );
    },
);