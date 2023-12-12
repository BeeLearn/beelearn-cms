import React from "react";
import { BiMenu } from "react-icons/bi";

import { PropsWithClassName, join } from "@/props";
import { showSideNavigation } from "@/modules/LayoutSideNavigation.module";

export default function MenuButton({ className }: PropsWithClassName) {
    return (
        <button onClick={showSideNavigation}>
            <BiMenu className={join("text-2xl text-stone-700 cursor-pointer md:hidden", className)} />
        </button>
    );
}