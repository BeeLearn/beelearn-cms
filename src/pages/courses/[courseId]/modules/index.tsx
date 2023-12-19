"use client";

import { useRouter } from "next/router";

import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { MdOutlineTag, MdOutlineDelete } from "react-icons/md";

import Api from "@/lib/api";
import Module from "@/api/models/module.model";

import type { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  getModules,
  moduleActions,
  moduleSelector,
} from "@/features/moduleSlice";

import Search from "@/components/Search";
import ListAction from "@/components/ListAction";
import ModuleList from "@/components/ModuleList";
import ModuleLayoutHeader from "@/components/ModuleLayoutHeader";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import CreateNewModuleDialog from "@/components/CreateNewModuleDialog";

type PageProps = {
  router: {
    query: {
      courseId: number;
    };
  };
};

export default function ModulesPage({ router: { query }}: PageProps) {
  const router = useRouter();
  const mounted = useMounted();
  const confirmDeleteDialogRef = useRef<DialogElement>(null);
  const createNewModuleDialogRef = useRef<DialogElement>(null);

  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.module);
  const modules = moduleSelector.selectAll(state);

  const [checkedModules, setCheckedModules] = useState<Module[]>([]);

  console.log(router);

  useEffect(() => {
    dispatch(
      getModules([
        {
          query: {
            course: query.courseId,
          },
        },
      ])
    );
  }, []);

  return (
    <>
      <ModuleLayoutHeader
        breadcrumb={state.breadcrumb}
        onCreateModuleClick={() =>
          createNewModuleDialogRef.current!.showModal()
        }
      />
      <section className="flex-1 flex flex-col space-y-4 px-2">
        <div className="flex space-x-2">
          <div className="flex-1 flex">
            <Search
              placeholder="Search by name or description"
              onSearch={async (value) => {
                await dispatch(getModules([{ query: { search: value } }]));
              }}
            />
          </div>
          {checkedModules.length > 0 && (
            <ListAction
              actions={[
                {
                  text: "Group",
                  icon: <MdOutlineTag className="text-xl" />,
                  onSelect() {
                    // Todo
                  },
                },
                {
                  text: <span className="text-red-500">Delete</span>,
                  icon: <MdOutlineDelete className="text-xl text-red-500" />,
                  onSelect() {
                    confirmDeleteDialogRef.current!.showModal();
                  },
                },
              ]}
            />
          )}
        </div>

        <ModuleList
          className="flex-1"
          modules={modules}
          loadingState={state.state}
          onModuleChecked={setCheckedModules}
          loadMore={
            state.next
              ? async () => {
                  await dispatch(getModules([{ url: state.next! }]));
                }
              : null
          }
          onEdit={async (module, data) => {
            const response = await Api.instance.moduleController.update({
              path: module.id,
              data,
            });

            const newModule = response.data;
            dispatch(
              moduleActions.updateOne({
                id: newModule.id,
                changes: newModule,
              })
            );

            return newModule;
          }}
          onDelete={async (module) => {
            await Api.instance.moduleController.remove({
              path: module.id,
            });

            dispatch(moduleActions.removeOne(module.id));
          }}
        />
      </section>
      {mounted &&
        createPortal(
          <CreateNewModuleDialog
            ref={createNewModuleDialogRef}
            onSave={async (data) => {
              const response = await Api.instance.moduleController.create({
                data: {
                  ...data,
                  course: query.courseId,
                },
              });

              dispatch(moduleActions.addOne(response.data));
            }}
          />,
          document.body
        )}

      {mounted &&
        createPortal(
          <ConfirmDeleteDialog
            ref={confirmDeleteDialogRef}
            onDelete={async () => {
              confirmDeleteDialogRef.current!.close();
              await toast.promise(
                async () => {
                  const ids = checkedModules.map((course) => course.id);

                  await Api.instance.moduleController.remove({
                    path: "bulk-delete",
                    query: {
                      ids: ids.join(","),
                    },
                  });

                  dispatch(moduleActions.removeMany(ids));
                  setCheckedModules([]);
                },
                {
                  pending: "Deleting, please wait a moment...",
                  success: "Modules deleted successfully.",
                  error: "An error occur, Try again!.",
                }
              );
            }}
          >
            <p className="text-lg font-medium">
              Do you want to delete Modules?
            </p>
            <p className="mt-1 text-sm text-stone-700">
              This action is irreversible when initiated. All lessons and topics
              under this modules will be deleted.
            </p>
          </ConfirmDeleteDialog>,
          document.body
        )}
    </>
  );
}
