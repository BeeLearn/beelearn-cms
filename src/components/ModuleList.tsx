"use client";

import Image from "next/image";

import { createPortal } from "react-dom";
import React, { useRef, useState } from "react";

import { toast } from "react-toastify";

import Module from "@/api/models/module.model";

import { DialogElement } from "@/global";
import { join, type PropsWithClassName } from "@/props";
import type { LoadingState } from "@/features/features";
import useMounted from "@/composable/useMounted";

import Empty from "@/assets/empty.svg";

import LoadMore from "@/components/LoadMore";
import EditModuleDialog from "@/components/EditModuleDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

import TableSortLabel from "@/widgets/TableSortLabel";

import ModuleListItem from "./ModuleListItem";

type ModuleListProps = {
  modules: Module[];
  loadingState: LoadingState["state"];
  loadMore?: (() => Promise<void>) | null;
  onModuleChecked: (Modules: Array<Module>) => void;
  onDelete: (module: Module) => Promise<void>;
  onEdit: (module: Module, data: Partial<Module>) => Promise<Module>;
} & PropsWithClassName;

export default function ModuleList({
  className,
  modules,
  loadingState,
  loadMore,
  onDelete,
  onEdit,
  onModuleChecked,
}: ModuleListProps) {
  const mounted = useMounted();

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [checkedModules, setCheckedModules] = useState(new Set<Module>());

  const editModuleDialogRef = useRef<DialogElement>(null);
  const confirmDeleteDialogRef = useRef<DialogElement>(null);

  const confirmDelete = async function (module: Module) {
    setSelectedModule(module);
    window.setTimeout(() => confirmDeleteDialogRef.current!.showModal());
  };

  return (
    <div className={join("table-container flex flex-col", className)}>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(event) => {
                  const checked = event.currentTarget.checked;

                  if (checked) {
                    setCheckedModules(new Set(modules));
                    onModuleChecked(modules);
                  } else {
                    setCheckedModules(new Set());
                    onModuleChecked([]);
                  }
                }}
              />
            </th>
            <th>Name</th>
            <th>Is visible</th>
            <TableSortLabel>Created At</TableSortLabel>
            <TableSortLabel>Updated At</TableSortLabel>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loadingState == "success" &&
            modules.map((module) => (
              <ModuleListItem
                key={module.id}
                module={module}
                isChecked={checkedModules.has(module)}
                onEditClick={async (module) => {
                  setSelectedModule(module);
                  setTimeout(() => editModuleDialogRef.current!.showModal());
                }}
                onDeleteClick={confirmDelete}
                onChecked={(checked, module) => {
                  if (checked) {
                    checkedModules.add(module);
                    onModuleChecked(Array.from(checkedModules.values()));
                    setCheckedModules(new Set(checkedModules));
                  } else {
                    checkedModules.delete(module);
                    onModuleChecked(Array.from(checkedModules.values()));
                    setCheckedModules(new Set(checkedModules));
                  }
                }}
              />
            ))}
        </tbody>
      </table>
      {loadingState == "idle" || loadingState == "pending" ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="s-8 progress progress-primary" />
        </div>
      ) : (
        modules.length === 0 && (
          <div className="flex-1 flex flex-col space-y-2 justify-center items-center">
            <Image src={Empty} alt="Empty modules" className="w-24 h-24" />
            <div className="text-center">
              <h1 className="text-xl font-medium">No modules yet!</h1>
              <p className="text-stone-700">
                Created modules will be founded here when added.
              </p>
            </div>
          </div>
        )
      )}

      {loadMore && <LoadMore onClick={loadMore} />}
      {mounted &&
        selectedModule &&
        createPortal(
          <EditModuleDialog
            module={selectedModule}
            ref={editModuleDialogRef}
            onSave={onEdit}
            onDelete={async (module) => {
              confirmDelete(module);
              confirmDeleteDialogRef.current.addListener("delete", () => {
                editModuleDialogRef.current!.close();
              });
            }}
          />,
          document.body
        )}
      {mounted &&
        selectedModule &&
        createPortal(
          <ConfirmDeleteDialog
            ref={confirmDeleteDialogRef}
            onDelete={async () => {
              await toast.promise(() => onDelete(selectedModule), {
                pending: "Deleting module",
                success: "Module deleted",
                error: "An unexpected error occur, try again!",
              });
            }}
          >
            <h1 className="text-2xl font-bold">
              Do you want to delete module?
            </h1>
            <p className="text-stone-700">
              Module will be deleted. Lessons and topics under this course will
              be deleted permanently. Do you still want to perform this action?
            </p>
          </ConfirmDeleteDialog>,
          document.body
        )}
    </div>
  );
}

