import { MdSearch } from "react-icons/md";

import { PropsWithClassName, join } from "@/props";
import { useState } from "react";

type SearchProps = {
    throttle?: number,
    placeholder: string,
    onSearch?: (value: string) => void, // Todo replace with non-null
} & PropsWithClassName;

export default function Search({ className, placeholder, throttle, onSearch }: SearchProps) {
    const [timer, setTimer] = useState<number>();

    return (
        <div className={join("flex space-x-2 items-center bg-white px-2 rounded", className)}>
            <MdSearch className="text-xl text-stone-700" />
            <input
                className="flex-1 py-2"
                placeholder={placeholder}
                onChange={
                    (event) => {
                        if (!onSearch) return;
                        if (timer) window.clearTimeout(timer);

                        setTimer(window.setTimeout(() => {
                            onSearch(event.target.value);
                        }, throttle ?? 500));
                    }
                } />
        </div>
    );
}