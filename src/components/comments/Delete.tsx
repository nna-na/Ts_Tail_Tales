import React from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface DeleteProps {
  id: string;
  onDelete: () => void;
}

export default function Delete({ id, onDelete }: DeleteProps) {
  const queryClient = useQueryClient();
  const parsedCommentId = Number(id); // 문자열을 숫자로 변환

  const deleteCommentMutation = useMutation(
    async () => {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/comments/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", id]);
        onDelete(); // 삭제 후에 onDelete 함수 호출
        window.location.reload();
      },
    }
  );

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      console.log(id); // 콘솔에 파싱된 commentId 출력
      try {
        await deleteCommentMutation.mutateAsync();
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
      }
    }
  };

  return <button onClick={handleDelete}>삭제</button>;
}
