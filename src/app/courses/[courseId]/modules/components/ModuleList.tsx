"use client";

import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

import Module from "@/api/models/module.model";

import { DialogElement } from "@/global";
import { join, type PropsWithClassName } from "@/props";
import type { LoadingState } from "@/features/features";
import useMounted from "@/composable/useMounted";

import LoadMore from "@/components/LoadMore";
import EditModuleDialog from "@/components/EditModuleDialog";
import TableSortLabel from "@/widgets/TableSortLabel";

import ModuleListItem from "./ModuleListItem";

type ModuleListProps = {
    modules: Module[],
    loadingState: LoadingState["state"],
    loadMore?: (() => Promise<void>) | null,
    onModuleChecked: (Modules: Array<Module>) => void,
    onDelete: (module: Module) => Promise<void>,
    onEdit: (module: Module, data: Partial<Module>) => Promise<Module>,
} & PropsWithClassName;

export default function ModuleList({ className, modules, loadingState, loadMore, onDelete, onEdit, onModuleChecked }: ModuleListProps) {
    const mounted = useMounted();

    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [checkedModules, setCheckedModules] = useState(new Set<Module>());

    const editModuleDialogRef = useRef<DialogElement>(null);

    return (
        <div className={join("table-container flex flex-col", className)}>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={
                                    (event) => {
                                        const checked = event.currentTarget.checked;

                                        if (checked) {
                                            setCheckedModules(new Set(modules));
                                            onModuleChecked(modules);
                                        } else {
                                            setCheckedModules(new Set());
                                            onModuleChecked([]);
                                        }

                                    }
                                } />
                        </th>
                        <th>Name</th>
                        <th>Is visible</th>
                        <TableSortLabel>Created At</TableSortLabel>
                        <TableSortLabel>Updated At</TableSortLabel>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loadingState == "success" && modules.map((module) => (
                            <ModuleListItem
                                key={module.id}
                                module={module}
                                isChecked={checkedModules.has(module)}
                                onEditClick={async (module) => {
                                    setSelectedModule(module);
                                    setTimeout(() => editModuleDialogRef.current!.showModal());
                                }}
                                onDeleteClick={onDelete}
                                onChecked={
                                    (checked, module) => {
                                        if (checked) {
                                            checkedModules.add(module);
                                            onModuleChecked(Array.from(checkedModules.values()));
                                            setCheckedModules(new Set(checkedModules));
                                        } else {
                                            checkedModules.delete(module);
                                            onModuleChecked(Array.from(checkedModules.values()));
                                            setCheckedModules(new Set(checkedModules));
                                        }

                                    }
                                } />
                        ))
                    }
                </tbody>
            </table>
            {
                (loadingState == "idle" || loadingState == "pending") && <div className="flex-1 flex justify-center items-center">
                    <div className="s-8 progress progress-primary" />
                </div>
            }

            {
                loadMore && <LoadMore onClick={loadMore} />
            }
            {
                mounted && selectedModule && createPortal(
                    <EditModuleDialog
                        module={selectedModule}
                        ref={editModuleDialogRef}
                        onSave={onEdit}
                        onDelete={onDelete} />,
                    document.body
                )
            }
        </div>
    );
}
