import { isAxiosError, HttpStatusCode } from "axios";

import Image from "next/image";

import { toast } from "react-toastify";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { MdCheck, MdClose, MdDelete, MdSearch, MdTag } from "react-icons/md";

import { Formik, Form } from "formik";
import { string, object, boolean } from "yup";

import { DialogElement } from "@/global";

import Api from "@/lib/api";
import { isURL } from "@/lib/validator";
import { diffObject } from "@/lib/arrayHelper";

import Tag from "@/api/models/tag.model";
import Course from "@/api/models/course.model";

import Dialog from "@/widgets/Dialog";
import ChipInput from "@/widgets/ChipInput";
import {
  TextInput,
  TextAreaInput,
  FileInput,
  InputToggle,
} from "@/widgets/TextInput";

import FormSubmitButton from "./FormSubmitButton";

import { LoadingState } from "@/features/features";

export type CreateCourse = NonNullable<Pick<Course, "name" | "description">>;

type EditCourseDialogProps = {
  course: Course;
  onDelete: (course: Course) => Promise<void>;
  onSave: (
    course: Course,
    data: Partial<Course>,
    multipart: boolean
  ) => Promise<Course>;
};

export default forwardRef<Partial<DialogElement>, EditCourseDialogProps>(
  function EditCourseDialog({ course, onSave, onDelete }, ref) {
    const dialogRef = useRef<DialogElement>(null);
    const fileRef = useRef<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useImperativeHandle(
      ref,
      () => {
        return {
          close: () => dialogRef.current!.close(),
          showModal: () => dialogRef.current!.showModal(),
        };
      },
      []
    );

    const [tags, setTags] = useState<Tag[] | null>(null);
    const tagFetchState = useRef<LoadingState["state"]>("idle");

    const searchTag = function (event: React.FormEvent<HTMLInputElement>) {
      const value = (event.target as HTMLInputElement).value;
      if (value.trim().length > 1) {
        tagFetchState.current = "pending";

        return Api.instance.tagController
          .list({
            query: { search: value },
          })
          .then(({ data }) => {
            tagFetchState.current = "success";
            setTags(data.results);
          })
          .catch(() => (tagFetchState.current = "failed"));
      }
    };

    return (
      <Dialog
        ref={dialogRef}
        overlayClassName="md:justify-right"
        className="fullscreen-dialog"
      >
        <header className="flex items-center space-x-4 py-2">
          <MdClose
            className="text-xl text-stone-700 cursor-pointer"
            onClick={() => dialogRef.current!.close()}
          />
          <h1 className="flex-1 text-xl font-extrabold">Edit Course</h1>
        </header>
        <Formik
          validationSchema={object().shape({
            is_visible: boolean().required(),
            illustration: string().required(),
            name: string().trim().required(),
            description: string().trim().max(128).required(),
          })}
          initialValues={course}
          onSubmit={async (
            values,
            { setSubmitting, setFieldError, resetForm }
          ) => {
            try {
              const payload = diffObject(course, values);
              if (payload.illustration) {
                const illustration = payload.illustration;
                const newCourse = await onSave(course, { illustration }, true);
                resetForm({ values: newCourse });

                delete payload["illustration"];
              }

              const newCourse = await onSave(course, payload, false);
              resetForm({ values: newCourse });

              toast.success("Course edited successfully.");
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
          onReset={() => {
            fileRef.current?.reset();
          }}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="flex-1 flex flex-col overflow-y-scroll">
              <div className="flex-1 flex flex-col space-y-4">
                {values.illustration && isURL(values.illustration) ? (
                  <div className="relative w-36 h-24 border">
                    <MdDelete
                      className="absolute top-0 right-0 text-2xl text-red-500"
                      onClick={() => {
                        setFieldValue("illustration", null);
                      }}
                    />
                    <Image
                      src={values.illustration}
                      alt={values.name}
                      width="64"
                      height="32"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                ) : (
                  <FileInput
                    ref={fileRef}
                    name="illustration"
                    text="Add Course Illustration"
                    accept="image/*"
                    error={touched.illustration ? errors.illustration : null}
                    onReset={() =>
                      setFieldValue("illustration", course.illustration)
                    }
                  />
                )}
                <TextInput
                  name="name"
                  placeholder="Course Name"
                  error={touched.name ? errors.name : null}
                />
                <TextAreaInput
                  name="description"
                  placeholder="Course Description"
                  error={touched.description ? errors.description : null}
                />
                <InputToggle
                  name="is_visible"
                  placeholder="Show modules, lessons & topics"
                  sub_placeholder="Enlisted course to our catalogue and will be visible to all learners."
                  error={touched.is_visible ? errors.is_visible : null}
                />
                <ChipInput
                  placeholder="Search tags"
                  values={tags}
                  selected={values.tags}
                  selectId={(value) => value.id}
                  displayValue={(value) => value.name}
                  setSelected={(values) => setFieldValue("tags", values)}
                  emptyChild={(state) => (
                    <TagEmptyState
                      state={state}
                      fetchState={tagFetchState.current}
                    />
                  )}
                  onInput={searchTag}
                >
                  {(value, selected) => (
                    <div
                      className={"flex space-x-2 items-center p-2 ".concat(
                        selected ? "bg-violet-100 text-violet-900" : ""
                      )}
                    >
                      {selected && <MdCheck className="text-xl" />}
                      <span className="text-nowrap">{value.name}</span>
                    </div>
                  )}
                </ChipInput>
              </div>
              <div className="flex space-x-4">
                <FormSubmitButton
                  type="button"
                  text="Delete"
                  className="flex-1 border-2 text-red-500"
                  submitting={isDeleting}
                  onClick={async () => {
                    onDelete(course);
                  }}
                />
                <FormSubmitButton
                  text="Save"
                  className="flex-1 btn btn-primary"
                  submitting={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    );
  }
);

type TagEmptyStateProps = {
  state: "empty" | "idle";
  fetchState: LoadingState["state"];
};

function TagEmptyState({ state, fetchState }: TagEmptyStateProps) {
  return (
    <div className="m-auto flex flex-col space-y-2 items-center">
      {state === "empty" ? (
        <>
          <div className="p-2 bg-violet-700 text-white rounded-full">
            <MdSearch className="text-xl" />
          </div>
          <p>No tag found. Try another keyword!</p>
        </>
      ) : fetchState === "idle" ? (
        <>
          <div className="p-2 bg-violet-700 text-white rounded-full">
            <MdTag className="text-xl" />
          </div>
          <p>Search for related tags</p>
        </>
      ) : (
        <div className="w-8 h-8 progress progress-primary" />
      )}
    </div>
  );
}

