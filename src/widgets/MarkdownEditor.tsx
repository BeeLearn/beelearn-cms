//import dynamic from "next/dynamic";
import { ChangeEvent, forwardRef, useState } from "react";

import MDEditor, { ContextStore, RefMDEditor } from "@uiw/react-md-editor";

import { PropsWithClassName } from "@/props";

import { InputContainer } from "./TextInput";

type MarkdownEditorProps = {
    value?: string,
    error?: string | null,
    onChange: (value?: string, event?: ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) => void,
} & PropsWithClassName;


// const MDEditor = dynamic(
//     () => import("@uiw/react-md-editor"),
//     { ssr: false }
//   );

export default forwardRef<typeof MDEditor, MarkdownEditorProps>(
    function MarkdownEditor({ className, error, value: defaultValue, onChange }, ref) {
        const [value, setValue] = useState(defaultValue);

        return (
            <InputContainer
                className={className}
                error={error}>
                <MDEditor
                    ref={ref}
                    className="h-full"
                    value={value}
                    onChange={(value, event, store) => {
                        setValue(value);
                        onChange(value, event, store);
                    }} />
            </InputContainer>
        )
    },
);