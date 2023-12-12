import { BiPlus } from "react-icons/bi";
import { MdErrorOutline, MdOutlineClose } from "react-icons/md";

import { Field, FieldArray, useFormikContext } from "formik";

import { TextInput } from "@/widgets/TextInput";
import { get } from "@/lib/arrayHelper";

export type Choice = {
    position?: number,
    name?: string,
    is_answer?: boolean,
    content_type?: string,
};

type QuestionChoiceProps = {
    name: string,
    value?: Array<Choice>,
    contentType?: string,
    checkType?: "radio" | "checkbox",
};

export const emptyChoice = (position: number, content_type?: string): Choice => ({
    position,
    content_type,
    name: "",
    is_answer: false,
});

export default function QuestionChoice({ name, checkType, contentType }: QuestionChoiceProps) {
    const { values, setFieldValue, errors, touched } = useFormikContext<any>();
    const error = get(errors, name);
    const touch = get(touched, name);
    const value = get(values, name);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-4">
                    <FieldArray
                        name={name}
                        render={
                            arrayHelpers => (
                                value.map((choice: Choice, index: number) => {
                                    const fieldError = Array.isArray(error) &&
                                        error.at(index) &&
                                        touch &&
                                        touch[index] &&
                                        (touch[index] as any).name ?
                                        (error[index] as unknown as Choice).name :
                                        null;

                                    return (
                                        <div
                                            key={index}
                                            className="flex space-x-2">
                                            {
                                                checkType && (
                                                    <Field
                                                        type={checkType}
                                                        checked={choice.is_answer}
                                                        name={`${name}.${index}.is_answer`}
                                                        onChange={
                                                            (event: React.ChangeEvent<HTMLInputElement>) => {
                                                                const checked = event.currentTarget.checked;
                                                                const getName = (index: number) => `${name}.${index}.is_answer`;

                                                                if (checkType == "radio")
                                                                    for (let idx = 0; idx < get(values, name).length; idx++)
                                                                        setFieldValue(getName(idx), false);

                                                                setFieldValue(getName(index), checked);
                                                            }} />
                                                )
                                            }
                                            <TextInput
                                                name={`${name}.${index}.name`}
                                                className="flex-1"
                                                placeholder="Choice Text"
                                                error={fieldError} />
                                            <button
                                                type="button"
                                                onClick={
                                                    () => {
                                                        if (value.length > 2) arrayHelpers.remove(index);
                                                    }
                                                }>
                                                <MdOutlineClose className="text-xl text-stone-700" />
                                            </button>
                                        </div>
                                    );
                                })
                            )
                        } />
                </div>
                {
                    error && !Array.isArray(error) &&
                    <div className="flex space-x-2 text-red-500">
                        <MdErrorOutline className="text-xl" />
                        <p className="text-sm">{error as unknown as string}</p>
                    </div>
                }
            </div>
            <button
                type="button"
                className="btn border border-violet text-violet-700"
                onClick={() => {
                    setFieldValue(
                        name,
                        value.concat(emptyChoice(value.length, contentType)),
                    );
                }}>
                <BiPlus className="text-xl"
                    disabled={true} />
                <span>New Choice</span>
            </button>
        </div>
    );
}