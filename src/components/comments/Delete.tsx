import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../supabase"; // Supabase 클라이언트 임포트

interface DeleteProps {
  id: string;
  onDelete: () => void;
}

export default function Delete({ id, onDelete }: DeleteProps) {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation(
    async () => {
      try {
        // Supabase를 사용하여 댓글 삭제
        const { error } = await supabase.from("comments").delete().eq("id", id);

        if (error) {
          console.error("댓글 삭제 중 오류 발생:", error);
          throw new Error("댓글 삭제 오류");
        }
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
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
