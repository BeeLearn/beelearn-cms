"use client";

import Link from "next/link";

import { toast } from "react-toastify";
import { MdCheckCircle, MdCancel, MdDelete, MdEdit, MdMoreVert } from "react-icons/md";

import Module from "@/api/models/module.model";
import ListAction from "@/components/ListAction";

type ModuleListItemProps = {
    module: Module,
    isChecked: boolean,
    onEditClick: (module: Module) => Promise<void>,
    onDeleteClick: (module: Module) => Promise<void>,
    onChecked: (checked: boolean, Module: Module) => void,
}

export default function ModuleListItem({ module, isChecked, onChecked, onEditClick, onDeleteClick }: ModuleListItemProps) {
    const moduleLink = `modules/${module.id}/lessons/`;

    return (
        <tr>
            <td>
                <input
                    checked={isChecked}
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={
                        (event) => {
                            const checked = event.currentTarget.checked;
                            onChecked(checked, module);
                        }
                    } />
            </td>
            <td className="text-violet-700">
                <Link href={moduleLink}>{module.name}</Link>
            </td>
            <td className="text-xl">
                {
                    module.is_visible ?
                        <MdCheckCircle className="text-green-500" />
                        : <MdCancel className="text-red-500" />
                }
            </td>
            <td>{module.created_at}</td>
            <td>{module.updated_at}</td>
            <td>
                <ListAction
                    actionClass="btn"
                    actionButton={<MdMoreVert className="text-xl" />}
                    actions={[
                        {
                            text: "Edit",
                            icon: <MdEdit className="text-xl" />,
                            onSelect() {
                                onEditClick(module);
                            },
                        },
                        {
                            text: "Delete",
                            icon: <MdDelete className="text-xl" />,
                            onSelect() {
                                toast.promise(
                                    async () => onDeleteClick(module),
                                    {
                                        pending: "Deleting module",
                                        success: "Module deleted",
                                        error: "An error occur, try again!",
                                    },
                                );
                            },
                        },

                    ]} />
            </td>
        </tr>
    );
}