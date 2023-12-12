import React from "react";
import { BiSolidSortAlt } from "react-icons/bi";

import { PropsWithClassName } from "@/props";

type TableSortLabelProps = React.PropsWithChildren & PropsWithClassName;

export default function TableSortLabel({ children, className }: TableSortLabelProps) {
    return (
        <th className={className}>
            <div className="lg:max-w-4/6 xl:max-w-5/9  mx-auto flex space-x-2 items-center">
                <div>{children}</div>
                <BiSolidSortAlt className="text-lg cursor-pointer" />
            </div>
        </th>
    );
}