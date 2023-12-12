import { ReactNode } from "react";
import { Menu } from "@headlessui/react";
import { MdExpandMore } from "react-icons/md";

import { join } from "@/props";

type Action = {
    icon?: React.ReactNode,
    text: string | React.ReactNode,
    onSelect: () => void,
};

type ListActionProps = {
    actions: Action[],
    actionClass?: string,
    actionButton?: ReactNode,
};

export default function ListAction({ actions, actionButton, actionClass }: ListActionProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className={actionClass ?? "btn btn-primary"}>
                {
                    actionButton ? actionButton : <>
                        <MdExpandMore className="text-xl" />
                        <span>Actions</span>
                    </>
                }
            </Menu.Button>
            <Menu.Items className="flex flex-col absolute py-2 mt-2 right-0 w-48 origin-top-right divide-y divide-gray-300 bg-white rounded-xl shadow border focus:outline-none z-5">
                {
                    actions.map((action, index) => (
                        <Menu.Item
                            key={index}>
                            {
                                ({ active }) => (
                                    <button
                                        className={join("w-full inline-flex space-x-2 items-center p-3", active ? "bg-violet-100" : "text-stone-700")}
                                        onClick={action.onSelect}>
                                        {action.icon}
                                        <span>{action.text}</span>
                                    </button>
                                )
                            }
                        </Menu.Item>
                    ))
                }
            </Menu.Items>
        </Menu>
    );
}