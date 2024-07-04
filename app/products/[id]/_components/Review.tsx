"use client";

import { Tables } from "@/types/supabase"
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { getCurrentSession } from "@/app/api/supabase/user";

const editReview = async ({ id, content }: { id: string, content: string }) => {
	const { data, error } = await createClient().from("reviews").update({ content }).eq("id", id);
	if (error) {
		throw new Error(error.message);
	}
	return data;
}

interface ReviewProps {
	review: Tables<"reviews">;
	onDelete: (id: string, email: string) => Promise<void>;
}

export function Review({ review, onDelete }: ReviewProps) {
	const [isEditing, setIsEditing] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const queryClient = useQueryClient();

	const enableEditing = async () => {
		const { session, error } = await getCurrentSession();

		const currentEmail = session?.user.email;
		const userId = session?.user.id;
		if (error || !currentEmail || !userId) {
			alert("로그인을 해주세요.");
			return;
		}

		if (currentEmail !== review.email) {
			alert("작성자가 아니라 수정할 수 없습니다.");
			return;
		}

		setIsEditing(true);
	};

	const disableEditing = () => {
		setIsEditing(false);
	}

	const editMutation = useMutation({
		mutationFn: editReview,
		onSuccess: () => {
			setIsEditing(false);
			alert("수정되었습니다");
			queryClient.invalidateQueries({ queryKey: ["reviews", review.product_id] })
		},
	});

	const onEdit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const content = textareaRef.current?.value;
		if (!content) {
			alert("입력하세요")
			return;
		}
		editMutation.mutate({ id: review.id, content })
	}

	return (
		<div key={review.id} className="flex flex-col gap-y-2">
			{isEditing ? (
				<form
					onSubmit={onEdit}
				>
					<textarea
						ref={textareaRef}
						defaultValue={review.content}
						className="border-2 w-full h-24 resize-none"></textarea>
					<button
						type="submit"

						className="bg-green-500 text-white p-2 rounded-md"
					>
						수정
					</button>
					<button
						type="button"
						onClick={disableEditing}
						className="bg-red-500 text-white p-2 rounded-md"
					>취소</button>
				</form>
			) : (
				<>
					<div>내용: {review.content}</div>
					<div className="text-right text-neutral-500">작성자: {review.email}</div>
					<div className="flex justify-end gap-x-2">
						<button
							onClick={enableEditing}
							className="bg-green-500 text-white p-2 rounded-md">수정</button>
						<button
							onClick={() => onDelete(review.id, review.email)}
							className="bg-red-500 text-white p-2 rounded-md">삭제</button>
					</div>
				</>
			)}

			<hr />
		</div>
	)
}