import { Fragment, useState, useEffect, useRef } from "react";
import { MdSearch, MdClose } from "react-icons/md";

type ChipInputProps<T> = {
    values?: T[] | null,
    selectId?: (value: T) => any,
    displayValue: (value: T) => any,
    selected: T[],
    setSelected: (value: T[]) => void,
    emptyChild?: (state: "empty" | "idle") => React.JSX.Element,
    children: (value: T, selected: boolean) => React.JSX.Element,
} & Omit<React.HTMLAttributes<HTMLInputElement>, "children">;

export default function ChipInput<T>({ displayValue, values, emptyChild, children, selected, setSelected, onInput, onChange, onKeyUp, selectId, ...props }: ChipInputProps<T>) {
    const eventLoopTimer = useRef<number>();
    const optionEl = useRef<HTMLDivElement | null>(null);
    const inputEl = useRef<HTMLInputElement | null>(null);

    const [blur, setBlur] = useState(true);

    let timer: number | undefined;

    const handleInputEvent = function (event: React.FormEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;

        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            if (onChange)
                onChange(event);
            if (onInput)
                onInput(event);
            if (onKeyUp)
                onKeyUp(event as React.KeyboardEvent<HTMLInputElement>);
        }, 500);

    }

    const compare = function (a: T, b: T) {
        const comparator = selectId ?? displayValue;
        return comparator(a) === comparator(b);
    }

    return (
        <div
            className="relative"
            onBlur={() => eventLoopTimer.current = window.setTimeout(() => setBlur(true), 0)}>
            <div className="flex flex-col space-y-2">
                <div className="input rounded-md">
                    <input
                        ref={inputEl}
                        className="flex-1"
                        {...props}
                        onKeyUp={handleInputEvent}
                        onInput={handleInputEvent}
                        onChange={handleInputEvent}
                        onFocus={() => setBlur(false)} />
                    <MdSearch className="text-xl" />
                </div>
                <div className="flex items-center space-x-2 overflow-x-scroll">
                    {
                        selected.map((value, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 bg-violet pl-2 pr-3 py-0.8 rounded-full">
                                <button
                                    type="button"
                                    className="flex items-center w-4 h-4 bg-white/80 text-stone-700 rounded-full"
                                    onClick={() => {
                                        setSelected(selected.filter(element => !compare(element, value)));
                                    }}>
                                    <MdClose />
                                </button>
                                <span className="text-sm">{displayValue(value)}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                !blur && <div
                    role="menu"
                    ref={optionEl}
                    className="absolute top-12 w-full h-64 flex flex-nowrap flex-col divide-y bg-white py-1 border shadow rounded overflow-y-scroll">
                    {
                        values ?
                            values.length < 1 ? emptyChild && emptyChild("empty")
                                : values.map((value, index) => {
                                    const exists = Boolean(selected.find(element => compare(element, value)));
                                    return <Fragment key={index}>
                                        <div
                                            role="button"
                                            className="flex flex-col"
                                            onClick={() => {
                                                window.clearTimeout(eventLoopTimer.current);

                                                if (exists)
                                                    setSelected(selected.filter(element => !compare(element, value)))
                                                else
                                                    setSelected(selected.concat(value));

                                                setBlur(true);
                                                if (inputEl.current)
                                                    inputEl.current.value = "";
                                            }}>
                                            {children(value, exists)}
                                        </div>
                                    </Fragment>
                                })
                            : emptyChild && emptyChild("idle")
                    }
                </div>
            }
        </div>
    )
}
