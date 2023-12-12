import Image from "next/image";

import { MdDelete, MdOutlinePhoto } from "react-icons/md";
import { BiSolidErrorCircle } from "react-icons/bi";
import React, { ChangeEvent, useImperativeHandle, useRef, useState } from "react";

import { Field, useFormikContext } from "formik";

import { join, PropsWithClassName } from "@/props";
import { ResetElementProps } from "@/global";

export type InputProps<T extends HTMLElement> = {
    name?: string,
    error?: string | null,
} & PropsWithClassName & React.HTMLAttributes<T>;


export const InputContainer = function ({ error, children, className }: Pick<InputProps<HTMLInputElement>, "error" | "children" | "className">) {
    return (
        <div className={join("flex flex-col space-y-1", className)}>
            {children}
            {
                error && <div className="flex space-x-1 items-center">
                    <div>
                        <BiSolidErrorCircle className="text-red-500" />
                    </div>
                    <p className="text-sm text-red-500 normal-case capitalize-first">{error}</p>
                </div>
            }
        </div>
    );
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps<HTMLInputElement>>(
    function TextInput({ className, ...props }, ref) {
        return (
            <InputContainer
                className={className}
                error={props.error}>
                <Field
                    ref={ref}
                    {...props}
                    className="input border p-2 rounded" />
            </InputContainer>
        )
    }
);

export const TextAreaInput = React.forwardRef<HTMLTextAreaElement, InputProps<HTMLTextAreaElement>>(
    function TextAreaInput({ className, ...props }, ref) {
        return (
            <InputContainer
                className={className}
                error={props.error}>
                <Field
                    as="textarea"
                    ref={ref}
                    {...props}
                    className="input border p-2 rounded" />
            </InputContainer>
        )
    }
);

type InputToggleProps = {
    sub_placeholder?: string,
} & InputProps<HTMLInputElement>;

export const InputToggle = React.forwardRef<HTMLInputElement, InputToggleProps>(
    function InputToggle({ placeholder, sub_placeholder, ...props }, ref) {
        return (
            <label
                className="relative inline-flex items-center justify-center space-x-2 cursor-pointer">
                <Field
                    ref={ref}
                    {...props}
                    type="checkbox"
                    className="sr-only peer" />
                <div className="toggle" />
                <div>
                    <p className="font-medium">{placeholder}</p>
                    {sub_placeholder && <p className="text-sm text-stone-700">{sub_placeholder}</p>}
                </div>
            </label>
        );
    });


type FileInputProps = {
    text: string,
    accept: string,
    onReset?: () => void,
} & InputProps<HTMLInputElement>;

export const FileInput = React.forwardRef<Partial<HTMLInputElement & ResetElementProps>, FileInputProps>(
    function FileInput({ className, text, onReset, ...props }, ref) {
        const fileRef = useRef<HTMLInputElement>(null);
        const form = useFormikContext<{ [key: string]: string }>();
        const [files, setFiles] = useState<File[] | null | undefined>(null);

        useImperativeHandle(ref, () => ({
            ...fileRef.current!,
            reset() {
                setFiles(null);
                fileRef.current!.value = "";
            }
        }));

        return (
            <InputContainer
                className={className}
                error={props.error}>
                {
                    files && <div className="mb-2">
                        {
                            files.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative w-36 h-24 border">
                                    <MdDelete
                                        className="absolute top-0 right-0 text-2xl text-red-500"
                                        onClick={
                                            () => {
                                                setFiles((files) => {
                                                    const values = files!.filter(element => element !== file);
                                                    if (values.length === 0 && onReset)
                                                        onReset();
                                                    return values;
                                                });
                                                form.setFieldValue(props.name!, null);
                                            }
                                        } />
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={index.toString()}
                                        width="64"
                                        height="32"
                                        className="h-full w-full object-cover rounded-xl" />
                                </div>
                            ))
                        }
                    </div>
                }
                <input
                    ref={fileRef}
                    {...props}
                    type="file"
                    className="hidden"
                    onChange={
                        (event: ChangeEvent<HTMLInputElement>) => {
                            const files = event.currentTarget.files;

                            if (files)
                                setFiles(Array.from(files));

                            form.setFieldValue(props.name!, files?.item(0));
                        }
                    } />
                <button
                    type="button"
                    className="btn border text-violet-700 border-dashed"
                    onClick={() => fileRef.current!.click()}>
                    <MdOutlinePhoto className="text-xl" />
                    <span>{text}</span>
                </button>
            </InputContainer>
        );
    });

