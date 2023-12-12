"use client";

import React, { useRef, useState } from "react";

import Topic from "@/api/models/topic.model";

import { join, type PropsWithClassName } from "@/props";
import type { LoadingState } from "@/features/features";

import LoadMore from "@/components/LoadMore";
import TableSortLabel from "@/widgets/TableSortLabel";

import TopicListItem from "./TopicListItem";
import useMounted from "@/composable/useMounted";
import { DialogElement } from "@/global";
import EditTopicDialog from "@/components/EditTopicDialog";
import { createPortal } from "react-dom";

type TopicListProps = {
    topics: Topic[],
    loadingState: LoadingState["state"],
    loadMore?: (() => Promise<void>) | null,
    onTopicChecked: (topics: Array<Topic>) => void,
    onDelete: (topic: Topic) => Promise<void>,
    onEdit: (topic: Topic, data: Partial<Topic>) => Promise<Topic>,
} & PropsWithClassName;

export default function TopicList({ className, topics, loadingState, loadMore, onEdit, onDelete, onTopicChecked }: TopicListProps) {
    const mounted = useMounted();

    const [selectedTopic, setSelectedTopic] = useState<Topic|null>(null);
    const [checkedTopics, setCheckedTopics] = useState(new Set<Topic>());

    const editTopicDialogRef = useRef<DialogElement>(null);

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
                                            setCheckedTopics(new Set(topics));
                                            onTopicChecked(topics);
                                        } else {
                                            setCheckedTopics(new Set());
                                            onTopicChecked([]);
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
                        loadingState == "success" && topics.map((topic) => (
                            <TopicListItem
                                key={topic.id}
                                topic={topic}
                                isChecked={checkedTopics.has(topic)}
                                onEditClick={async (topic) => {
                                    setSelectedTopic(topic);
                                    setTimeout(() => editTopicDialogRef.current!.showModal());
                                }}
                                onDeleteClick={onDelete}
                                onChecked={
                                    (checked, topic) => {
                                        if (checked) {
                                            checkedTopics.add(topic);
                                            onTopicChecked(Array.from(checkedTopics.values()));
                                            setCheckedTopics(new Set(checkedTopics));
                                        } else {
                                            checkedTopics.delete(topic);
                                            onTopicChecked(Array.from(checkedTopics.values()));
                                            setCheckedTopics(new Set(checkedTopics));
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
                mounted && selectedTopic && createPortal(
                    <EditTopicDialog
                        topic={selectedTopic}
                        ref={editTopicDialogRef}
                        onSave={onEdit}
                        onDelete={onDelete} />,
                    document.body
                )
            }
        </div>
    );
}
