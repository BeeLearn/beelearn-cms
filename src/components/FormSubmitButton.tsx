import { HTMLAttributes } from "react";
import { join, PropsWithClassName } from "@/props";

type FormSubmitButtonProps = {
    type?: "submit" | "reset" | "button",
    text: string,
    submitting: boolean,
} & PropsWithClassName & HTMLAttributes<HTMLButtonElement>;

export default function FormSubmitButton({ type, text, submitting, className, ...props }: FormSubmitButtonProps) {
    return (
        <button
            type={type ?? "submit"}
            disabled={submitting}
            className={join("btn", className ?? "btn-primary")}
            {...props}>
            {
                submitting ?
                    <div className="w-6 h-6 border-3 border-white border-t-violet-700 rounded-full animate-spin" />
                    : <span>{text}</span>
            }
        </button>
    );
}