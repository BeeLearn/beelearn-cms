import { isAxiosError, HttpStatusCode } from "axios";

import React from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { Formik, Form } from "formik";
import { object, string } from "yup";

import { DialogElement } from "@/global";
import { PropsWithClassName } from "@/props";

import Dialog from "@/widgets/Dialog";
import { TextInput, TextAreaInput } from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";
import Module from "@/api/models/module.model";

export type CreateModule = Pick<Module, "name" | "description">;

type CreateNewModuleDialogProps = {
    onSave: (value: CreateModule) => Promise<void>,
} & PropsWithClassName & React.HTMLAttributes<HTMLDivElement>;

export default React.forwardRef<Partial<DialogElement>, CreateNewModuleDialogProps>(
    function CreateNewModuleDialog({ onSave }, ref) {
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
                    <h1 className="flex-1 text-xl font-extrabold">New Module</h1>
                </header>
                <Formik
                    validationSchema={object().shape({
                        name: string().required(),
                        description: string().notRequired(),
                    })}
                    initialValues={{
                        name: "",
                        description: "",
                        visible: true,
                    }}
                    onSubmit={
                        async (values, { setSubmitting, setFieldError, resetForm }) => {
                            try {
                                await onSave(values);

                                resetForm();
                                toast.success("New course added successfully!");
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
                        ({ errors, touched, isSubmitting }) => (
                            <Form className="flex-1 flex flex-col">
                                <div className="flex-1 flex flex-col space-y-4">
                                    <TextInput
                                        name="name"
                                        placeholder="Name"
                                        error={touched.name ? errors.name : null} />
                                    <TextAreaInput
                                        name="description"
                                        placeholder="Description"
                                        error={touched.description ? errors.description : null} />

                                </div>
                                <FormSubmitButton
                                    text="Create Module"
                                    submitting={isSubmitting} />
                            </Form>
                        )
                    }
                </Formik>
            </Dialog>
        );
    },
);