import { isAxiosError, HttpStatusCode } from "axios";

import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { boolean, object, string } from "yup";
import { Formik, Form } from "formik";

import type { DialogElement } from "@/global";
import { diffObject } from "@/lib/arrayHelper";
import Lesson from "@/api/models/lesson.model";

import Dialog from "@/widgets/Dialog";
import { TextInput, TextAreaInput, InputToggle } from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";

type CreateNewLessonDialogProps = {
  lesson: Lesson;
  onDelete: (lesson: Lesson) => Promise<void>;
  onSave: (lesson: Lesson, value: Partial<Lesson>) => Promise<Lesson>;
};

export default React.forwardRef<
  Partial<DialogElement>,
  CreateNewLessonDialogProps
>(function CreateNewLessonDialog({ lesson, onSave, onDelete }, ref) {
  const dialogRef = React.useRef<DialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        close: () => dialogRef.current!.close(),
        showModal: () => dialogRef.current!.showModal(),
      };
    },
    []
  );

  return (
    <Dialog
      ref={dialogRef}
      overlayClassName="md:justify-right"
      className="w-full h-full bg-white md:w-1/2 lg:w-1/3 md:h-full md:rounded-none"
    >
      <header className="flex items-center space-x-4 py-2">
        <MdClose
          className="text-xl text-stone-700 cursor-pointer"
          onClick={() => dialogRef.current!.close()}
        />
        <h1 className="flex-1 text-xl font-extrabold">Edit Lesson</h1>
      </header>
      <Formik
        validationSchema={object().shape({
          is_visible: boolean().required(),
          name: string().required(),
          description: string().notRequired(),
        })}
        initialValues={lesson}
        onSubmit={async (
          values,
          { setSubmitting, setFieldError, resetForm }
        ) => {
          try {
            const newLesson = await onSave(lesson, diffObject(lesson, values));

            resetForm({ values: newLesson });
            toast.success("Lesson edited successfully.");
          } catch (error) {
            if (
              isAxiosError(error) &&
              error.response?.status === HttpStatusCode.BadRequest
            ) {
              const response = error.response;
              const data = response.data;

              for (let [field, value] of Object.entries(data)) {
                setFieldError(
                  field,
                  Array.isArray(value) ? value.join(".") : (value as string)
                );
              }
            }

            toast.error("An unexpected error occurred, Try again!");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col space-y-4">
              <TextInput
                name="name"
                placeholder="Lesson name"
                error={errors.name}
              />
              <TextAreaInput
                name="description"
                placeholder="Description"
                error={errors.description}
              />
              <InputToggle
                name="is_visible"
                placeholder="Show topics to learners"
                sub_placeholder="Lesson would be enlisted to our catalogue and will be visible to all learners."
                error={errors.is_visible}
              />
            </div>
            <div className="flex space-x-2">
              <FormSubmitButton
                type="button"
                text="Delete"
                className="flex-1 border-2 text-red-500"
                submitting={isDeleting}
                onClick={async () => {
                  await onDelete(lesson);
                }}
              />
              <FormSubmitButton
                text="Save"
                className="flex-1 btn-primary"
                submitting={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
});

