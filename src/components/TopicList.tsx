"use client";

import Image from "next/image";

import { createPortal } from "react-dom";
import React, { useRef, useState } from "react";

import { toast } from "react-toastify";

import Topic from "@/api/models/topic.model";

import Empty from "@/assets/empty.svg";

import { DialogElement } from "@/global";
import useMounted from "@/composable/useMounted";
import type { LoadingState } from "@/features/features";
import { join, type PropsWithClassName } from "@/props";

import LoadMore from "@/components/LoadMore";
import EditTopicDialog from "@/components/EditTopicDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

import TableSortLabel from "@/widgets/TableSortLabel";

import TopicListItem from "./TopicListItem";

type TopicListProps = {
  topics: Topic[];
  loadingState: LoadingState["state"];
  loadMore?: (() => Promise<void>) | null;
  onTopicChecked: (topics: Array<Topic>) => void;
  onDelete: (topic: Topic) => Promise<void>;
  onEdit: (topic: Topic, data: Partial<Topic>) => Promise<Topic>;
} & PropsWithClassName;

export default function TopicList({
  className,
  topics,
  loadingState,
  loadMore,
  onEdit,
  onDelete,
  onTopicChecked,
}: TopicListProps) {
  const mounted = useMounted();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [checkedTopics, setCheckedTopics] = useState(new Set<Topic>());

  const editTopicDialogRef = useRef<DialogElement>(null);
  const confirmDeleteDialogRef = useRef<DialogElement>(null);

  const confirmDelete = async function (topic: Topic) {
    setSelectedTopic(topic);
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
                    setCheckedTopics(new Set(topics));
                    onTopicChecked(topics);
                  } else {
                    setCheckedTopics(new Set());
                    onTopicChecked([]);
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
            topics.map((topic) => (
              <TopicListItem
                key={topic.id}
                topic={topic}
                isChecked={checkedTopics.has(topic)}
                onEditClick={async (topic) => {
                  setSelectedTopic(topic);
                  setTimeout(() => editTopicDialogRef.current!.showModal());
                }}
                onDeleteClick={confirmDelete}
                onChecked={(checked, topic) => {
                  if (checked) {
                    checkedTopics.add(topic);
                    onTopicChecked(Array.from(checkedTopics.values()));
                    setCheckedTopics(new Set(checkedTopics));
                  } else {
                    checkedTopics.delete(topic);
                    onTopicChecked(Array.from(checkedTopics.values()));
                    setCheckedTopics(new Set(checkedTopics));
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
        topics.length === 0 && (
          <div className="flex-1 flex flex-col space-y-2 justify-center items-center">
            <Image src={Empty} alt="Empty topic" className="w-24 h-24" />
            <div className="text-center">
              <h1 className="text-xl font-medium">No topics yet!</h1>
              <p className="text-stone-700">
                Created topics will be founded here when added.
              </p>
            </div>
          </div>
        )
      )}

      {loadMore && <LoadMore onClick={loadMore} />}
      {mounted &&
        selectedTopic &&
        createPortal(
          <EditTopicDialog
            topic={selectedTopic}
            ref={editTopicDialogRef}
            onSave={onEdit}
            onDelete={async (lesson) => {
              confirmDelete(lesson);
              confirmDeleteDialogRef.current.addListener("delete", () => {
                editTopicDialogRef.current!.close();
              });
            }}
          />,
          document.body
        )}

      {mounted &&
        selectedTopic &&
        createPortal(
          <ConfirmDeleteDialog
            ref={confirmDeleteDialogRef}
            onDelete={async () => {
              await toast.promise(() => onDelete(selectedTopic), {
                pending: "Deleting topic",
                success: "Topic deleted",
                error: "An error occur, try again!",
              });
            }}
          >
            <h1 className="text-2xl font-bold">Do you want to delete topic?</h1>
            <p className="text-stone-700">
              Topic will be deleted. Do you still want to perform this action?
            </p>
          </ConfirmDeleteDialog>,
          document.body
        )}
    </div>
  );
}

