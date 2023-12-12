import Image from "next/image";
import { BsChevronDown } from "react-icons/bs";

import type User from "@/api/models/user.model";

import { PropsWithClassName, join } from "@/props";

type AccountPickerProps = {
    user: User,
} & PropsWithClassName;

export default function AccountPicker({ user, className }: AccountPickerProps) {
    const fullName = user.first_name + " "+ user.last_name;
    
    return (
        <div
            className={join("flex items-center space-x-2 border px-2 py-0.5 rounded-full cursor-pointer", className)}
            at-md="p-0 border-0">
            <div>
                <Image 
                    className="w-8 h-8 rounded-full"
                    src={user.avatar}
                    width="245"
                    height="256"
                    alt={fullName} />
            </div>
            <div
                className="flex-1 flex flex-col"
                at-md="hidden">
                <p className="text-sm truncate text-stone-700 truncate">{fullName}</p>
            </div>
            <button>
                <BsChevronDown at-md="hidden" />
            </button>
        </div>
    );
}