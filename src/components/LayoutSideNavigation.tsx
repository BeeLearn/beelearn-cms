"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    MdClose,
    MdOutlineLibraryBooks,
    MdLibraryBooks,
    MdOutlineSettings,
    MdOutlineCategory,
    MdOutlineNotifications,
    MdSettings,
    MdCategory,
    MdNotifications,
    MdOutlineQuestionMark,
    MdQuestionMark,
} from "react-icons/md";

import { join, PropsWithClassName } from "@/props";
import AccountPicker from "@/components/AccountPicker";
import { hideSideNavigation } from "@/modules/LayoutSideNavigation.module";
import { useAppSelector } from "@/app/hooks";
import User from "@/api/models/user.model";


interface NavRouteItemProps {
    path: string,
    name: string,
    icon: React.ReactNode,
    activeClassName?: string,
    selectedIcon?: React.ReactNode,
    visibleWhen?: (user: User) => boolean,
}

function NavigationRouteItem({ name, icon, path, className, activeClassName, selectedIcon }: NavRouteItemProps & PropsWithClassName) {
    const currentPath = usePathname();

    const inActiveClass = "text-stone-700";
    const activeClass = join("text-violet-700", activeClassName);

    const active = path == "/" ? currentPath == path : currentPath?.includes(path);


    return (
        <Link
            href={path}
            className={join("flex items-center space-x-2 p-4", className, active ? activeClass : inActiveClass)}>
            {active ? selectedIcon ?? icon : icon}
            <p className="md:hidden lg:block">{name}</p>
        </Link>
    );
}

const navigationRoutes: Array<NavRouteItemProps> = [
    {
        path: "/",
        name: "Home",
        icon: <MdOutlineCategory className="text-xl" />,
        selectedIcon: <MdCategory className="text-xl" />,
        visibleWhen: (user) => user.is_superuser,
    },
    {
        path: "/courses",
        name: "Courses",
        icon: <MdOutlineLibraryBooks className="text-xl" />,
        selectedIcon: <MdLibraryBooks className="text-xl" />,
        visibleWhen: (user) => user.is_staff,
    },
    {
        path: "/questions",
        name: "Questions",
        icon: <MdOutlineQuestionMark className="text-xl" />,
        selectedIcon: <MdQuestionMark className="text-xl" />,
        visibleWhen: (user) => user.is_staff,
    },
];

export default function LayoutSideNavigation() {
    const userState = useAppSelector(state => state.user);

    return (
        <nav
            id="side-navigation"
            className="hidden fixed inset-0 bg-[rgba(0,0,0,0.5)] border-r z-10 md:static md:flex md:flex-col md:w-auto md:bg-none lg:w-1/5 xl:w-1/6">
            <div
                id="side-navigation-container"
                className="flex-1 w-4/5 h-full flex flex-col space-y-4 bg-white md:w-auto at-md:px-2 lt-md:animate-slide-in-left lt-md:animate-duration-200">
                <div className="flex p-4 md:hidden">
                    <MdClose
                        className="text-2xl cursor-pointer text-stone-700"
                        onClick={hideSideNavigation} />
                </div>
                <AccountPicker
                    className="mx-2"
                    user={userState.user!} />
                <div className="flex-1 flex flex-col pr-4 at-md:items-center at-md:p-0">
                    {
                        navigationRoutes.filter(route => route.visibleWhen!(userState.user!)).map((item) => (
                            <NavigationRouteItem
                                key={item.path}
                                {...item}
                                className="p-4"
                                activeClassName="bg-violet-200 at-md:rounded rounded-l-0 rounded-r-full" />
                        ))
                    }
                </div>
                {/* <div>
                    <NavigationRouteItem
                        path="/settings"
                        name="Setting"
                        icon={<MdOutlineSettings className="text-xl" />}
                        selectedIcon={<MdSettings className="text-xl" />}
                        className="border-t" />
                </div> */}
            </div>
        </nav>
    );
}
