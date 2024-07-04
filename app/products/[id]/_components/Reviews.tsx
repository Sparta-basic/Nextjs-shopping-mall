"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FormEvent, useRef } from "react";
import { Review } from "./Review";
import { getReviews, addReview, deleteReview } from "@/app/api/supabase/reviews";
import { getCurrentSession } from "@/app/api/supabase/user";

export function Reviews() {
	const params = useParams<{ id: string }>();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { data: reviews } = useQuery({
		queryKey: ["reviews", params.id],
		queryFn: () => getReviews(params.id)
	});

	const queryClient = useQueryClient();

	const addMutation = useMutation({
		mutationFn: addReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reviews", params.id] })
			if (textareaRef.current) {
				textareaRef.current.value = "";
			}
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteReview,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reviews", params.id] })
		},
		onError: () => {
			alert("삭제 중 에러가 발생했습니다.")
		}
	})

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { session, error } = await getCurrentSession();
		const email = session?.user.email;
		const userId = session?.user.id;

		if (error || !email || !userId) {
			alert("로그인을 해주세요.");
			return;
		}

		const content = textareaRef.current?.value;

		if (!content) {
			alert("내용을 입력하세요");
			return;
		}

		addMutation.mutate({ content, email, productId: params.id, userId })
	}

	const onDelete = async (id: string, email: string) => {
		const { session, error } = await getCurrentSession();

		const currentEmail = session?.user.email;
		const userId = session?.user.id;

		if (error || !currentEmail || !userId) {
			alert("로그인 해주세요.")
			return;
		}

		if (currentEmail !== email) {
			alert("작성자가 아니라 삭제할 수 없습니다.")
			return;
		}

		const isConfirmed = confirm("정말로 삭제하시겠습니까?");
		if (!isConfirmed) {
			return;
		}
		deleteMutation.mutate(id);
	}

	return (
		<div className="mt-4 flex flex-col gap-y-4" >
			<h3 className="text-xl font-bold mb-4">후기 작성</h3>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 items-end">
				<textarea
					ref={textareaRef}
					className="border-2 w-full h-24 resize-none"></textarea>
				<button className="bg-blue-500 text-white p-2 rounded-md w-12">작성</button>
			</form>
			<div className="border-2 p-4">
				{reviews?.map((review) => (
					<Review key={review.id} review={review} onDelete={onDelete} />
				))}
			</div>
		</div >
	)
}