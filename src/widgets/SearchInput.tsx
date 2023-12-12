import { MdSearch } from "react-icons/md";

import { Combobox } from "@headlessui/react";

type SearchChildrenProps<T> = {
    value: T,
    active: boolean,
    selected: boolean,
}

type SearchInputProps<T> = {
    values: T[],
    selected: boolean,
    displayValue?: (value: T) => any,
    setSelected: (value: boolean) => void,
    onChange: (event: React.ChangeEvent) => void,
    children: (props: SearchChildrenProps<T>) => React.JSX.Element,
} & React.HTMLAttributes<HTMLInputElement>;

export default function SearchInput<T>({ values, selected, setSelected, children, displayValue, ...props }: SearchInputProps<T>) {
    return (
        <Combobox
            value={selected}
            onChange={setSelected}>
            <div className="relative">
                <div className="input border rounded">
                    <Combobox.Input
                        className="flex-1"
                        placeholder="Course Tags"
                        {...props} />
                    <MdSearch class="text-xl" />
                </div>
                <Combobox.Options className="absolute w-full h-48 bg-white border border-t-0 shadow rounded-b">
                    {
                        values.map((value, index) => (
                            <Combobox.Option
                                key={index}
                                value={value}>
                                {({ active, selected }) => (children && children({ value, selected, active }))}
                            </Combobox.Option>
                        ))
                    }
                </Combobox.Options>
            </div>
        </Combobox>
    );
}