"use client";

import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { MdOutlineTag, MdOutlineDelete } from "react-icons/md";

import Api from "@/lib/api";
import Topic from "@/api/models/topic.model";

import type { DialogElement } from "@/global";
import { useAppDispatch, useAppSelector } from "@/hooks";

import useMounted from "@/composable/useMounted";
import { getTopics, topicActions, topicSelector } from "@/features/topicSlice";

import Search from "@/components/Search";
import ListAction from "@/components/ListAction";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import CreateNewTopicDialog from "@/components/CreateNewTopicDialog";

import TopicList from "@/components/TopicList";
import TopicLayoutHeader from "@/components/TopicLayoutHeader";


export default function TopicsPage({ params }: { params: { lessonId: number } }) {
	const mounted = useMounted();
	const confirmDeleteDialogRef = useRef<DialogElement>(null);
	const createNewTopicDialogRef = useRef<DialogElement>(null);

	const dispatch = useAppDispatch();
	const state = useAppSelector((store) => store.topic);
	const Topics = topicSelector.selectAll(state);

	const [checkedTopics, setCheckedTopics] = useState<Topic[]>([]);

	useEffect(() => {
		dispatch(getTopics([{
			query: {
				lesson: params?.lessonId,
			}
		}]));
	}, []);

	return (
		<>
			<TopicLayoutHeader
				breadcrumb={state.breadcrumb}
				onCreateTopicClick={() => createNewTopicDialogRef.current!.showModal()} />
			<section className="flex-1 flex flex-col space-y-4 px-2">
				<div className="flex space-x-2">
					<div className="flex-1 flex">
						<Search
							placeholder="Search by name or description"
							onSearch={
								async (value) => {
									await dispatch(getTopics([{ query: { search: value } }]));
								}
							} />
					</div>
					{
						checkedTopics.length > 0 && <ListAction actions={
							[
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
										confirmDeleteDialogRef.current!.showModal()
									},
								},
							]
						} />
					}
				</div>

				<TopicList
					className="flex-1"
					topics={Topics}
					loadingState={state.state}
					onTopicChecked={setCheckedTopics}
					loadMore={state.next ?
						async () => {
							await dispatch(getTopics([{ url: state.next!, }]));
						}
						: null
					}
					onEdit={async (topic, data) => {
						const response = await Api.instance.topicController.update({
							path: topic.id,
							data,
						});

						const newTopic = response.data;
						dispatch(topicActions.updateOne({
							id: newTopic.id,
							changes: newTopic,
						}));

						return newTopic;
					}}
					onDelete={async (topic) => {
						await Api.instance.topicController.remove({
							path: topic.id,
						});

						dispatch(topicActions.removeOne(topic.id));
					}} />
			</section>
			{
				mounted && createPortal(
					<CreateNewTopicDialog
						ref={createNewTopicDialogRef}
						onSave={async (data) => {
							const response = await Api.instance.topicController.create({
								data: {
									...data,
									lesson: params?.lessonId,
								},
							});

							dispatch(topicActions.addOne(response.data));
						}} />,
					document.body,
				)
			}

			{
				mounted && createPortal(
					<ConfirmDeleteDialog
						ref={confirmDeleteDialogRef}
						onDelete={async () => {
							confirmDeleteDialogRef.current!.close();
							await toast.promise(
								async () => {
									const ids = checkedTopics.map((course) => course.id);

									await Api.instance.topicController.remove({
										path: "bulk-delete",
										query: {
											ids: ids.join(","),
										}
									});

									dispatch(topicActions.removeMany(ids));
									setCheckedTopics([]);
								},
								{
									pending: "Deleting, please wait a moment...",
									success: "Lessons deleted successfully.",
									error: "An error occur, Try again!.",
								}
							);
						}}>
						<p className="text-lg font-medium">Do you want to delete Topic?</p>
						<p className="mt-1 text-sm text-stone-700">This action is irreversible when initiated. All topics under this Topic will be deleted.</p>
					</ConfirmDeleteDialog>,
					document.body,
				)
			}
		</>
	);
}