import React from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface DeleteProps {
  commentId: string;
  onDelete: () => void;
}

export default function Delete({ commentId, onDelete }: DeleteProps) {
  const queryClient = useQueryClient();
  const parsedCommentId = parseInt(commentId); // 문자열을 숫자로 변환

  const deleteCommentMutation = useMutation(
    async () => {
      await axios.delete(`http://localhost:4000/comments/${parsedCommentId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", parsedCommentId]);
        onDelete(); // 삭제 후에 onDelete 함수 호출
      },
    }
  );

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteCommentMutation.mutateAsync();
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
      }
    }
  };

  return <button onClick={handleDelete}>삭제</button>;
}
