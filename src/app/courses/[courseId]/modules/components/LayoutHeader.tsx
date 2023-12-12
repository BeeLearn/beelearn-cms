import { useRouter } from "next/navigation";

import { Fragment } from "react";
import { MdAdd, MdChevronRight } from "react-icons/md";

import MenuButton from "@/components/MenuButton";
import { ModuleBreadCrumb } from "@/api/models/module.model";

type LayoutHeaderProps = {
    breadcrumb?: ModuleBreadCrumb,
    onCreateModuleClick: () => void,
}

export default function LayoutHeader({ breadcrumb, onCreateModuleClick }: LayoutHeaderProps) {
    const router = useRouter();

    return (
        <header className="flex flex-col space-y-2 p-4">
            <div className="flex space-x-4 items-center md:space-x-0">
                <MenuButton />
                <div className="flex-1">
                    <h1 className="text-xl font-extrabold">Modules</h1>
                </div>
                <button
                    className="btn btn-success truncate"
                    onClick={onCreateModuleClick}>
                    <MdAdd />
                    <span>New Module</span>
                </button>
            </div>
            <div className="flex space-x-2 items-center">
                <div className="flex space-x-2 items-center">
                    {
                        breadcrumb && Object.entries(breadcrumb).map(([key, value]) => (
                            <Fragment key={key}>
                                <button
                                    className="text-violet-700 text-nowrap"
                                    onClick={() => {
                                        switch (key) {
                                            case "course":
                                                router.push(`/courses/`);
                                                break;
                                        }
                                    }}>{value.name}</button>
                                <div>
                                    <MdChevronRight className="text-xl text-stone-500" />
                                </div>
                            </Fragment>
                        ))
                    }
                    <span>Modules</span>
                </div>
            </div>
        </header>
    );
}