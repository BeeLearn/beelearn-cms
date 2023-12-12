import { isAxiosError, HttpStatusCode } from "axios";

import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { Formik, Form } from "formik";
import { boolean, object, string } from "yup";

import { DialogElement } from "@/global";
import { PropsWithClassName } from "@/props";

import Dialog from "@/widgets/Dialog";
import { TextInput, TextAreaInput, InputToggle } from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";
import Module from "@/api/models/module.model";
import { diffObject } from "@/lib/arrayHelper";


type CreateNewModuleDialogProps = {
    module: Module,
    onSave: (module: Module, value: Partial<Module>) => Promise<Module>,
    onDelete: (module: Module) => Promise<void>,
} & PropsWithClassName & React.HTMLAttributes<HTMLDivElement>;

export default React.forwardRef<Partial<DialogElement>, CreateNewModuleDialogProps>(
    function CreateNewModuleDialog({ module, onSave, onDelete }, ref) {
        const dialogRef = React.useRef<DialogElement>(null);
        const [isDeleting, setIsDeleting] = useState(false);


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
                    <h1 className="flex-1 text-xl font-extrabold">Edit Module</h1>
                </header>
                <Formik
                    validationSchema={object().shape({
                        name: string().required(),
                        description: string().notRequired(),
                        is_visible: boolean().required(),
                    })}
                    initialValues={module}
                    onSubmit={
                        async (values, { setSubmitting, setFieldError, resetForm }) => {
                            try {
                                const newModule = await onSave(values, diffObject(module, values));

                                resetForm({ values: newModule });
                                toast.success("Module edited successfully!");
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
                                    <InputToggle
                                        name="is_visible"
                                        placeholder="Show lessons & topics under module"
                                        sub_placeholder="Enlisted module to our catalogue and will be visible to all learners."
                                        error={touched.is_visible ? errors.is_visible : null} />
                                </div>
                                <div className="flex space-x-4">
                                    <FormSubmitButton
                                        text="Delete"
                                        className="flex-1 border-2 text-red-500"
                                        submitting={isDeleting}
                                        onClick={async () => {
                                            setIsDeleting(true);
                                            try {
                                                await onDelete(module);
                                                toast.success("Module deleted successfully");
                                            }
                                            catch (error) {
                                                toast.error("Can't delete module, try again!");
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
                        )
                    }
                </Formik>
            </Dialog>
        );
    },
);