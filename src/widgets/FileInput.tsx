import Image from "next/image";
import React, { ChangeEvent, useImperativeHandle, useRef } from "react";
import { Field } from "formik";
import { MdOutlinePhoto } from "react-icons/md";
import { InputProps, InputContainer } from "./TextInput";



export const FileInput = React.forwardRef<Partial<HTMLInputElement>, InputProps<HTMLInputElement> & { text: string; }>(
function FileInput({ className, text, ...props }, ref) {
const files = useState<FileList>(null);
const fileRef = useRef<HTMLInputElement>(null);

useImperativeHandle(ref, () => fileRef.current!);

return (
<InputContainer
className={className}
error={props.error}>
<Image
src=""
alt="" />
<Field
innerRef={fileRef}
{...props}
type="file"
className="hidden"
onChange={(event: ChangeEvent<HTMLInputElement>) => {
const files = event.currentTarget.files;
}} />
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
