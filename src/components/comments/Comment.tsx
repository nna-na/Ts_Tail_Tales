import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Edit from "./Edit";
import Delete from "./Delete";

interface CommentProps {
  comments: Comment[];
}

export default function Comment({ comments }: CommentProps) {
  const { id } = useParams<{ id: string }>();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [deleted, setDeleted] = useState(false);

  const { data, isLoading, isError, error } = useQuery(
    ["comments"],
    async () => {
      const response = await axios.get(`http://localhost:4000/comments`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  const handleDelete = () => {
    setDeleted(true);
  };

  const handleUpdateComplete = () => {
    setEditingCommentId(null);
  };

  if (isLoading) {
    return <div>로딩 중 ...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  if (!data && !deleted) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      {deleted ? (
        <div>댓글이 삭제되었습니다.</div>
      ) : (
        <>
          {data.map((comment: any, user: any) => (
            <div key={comment.id}>
              <div>작성자: {comment.userNickname}님</div>
              <div>{comment.date}</div>
              <div>제목: {comment.title}</div>
              <div>내용: {comment.content}</div>
              {editingCommentId === comment.id ? (
                <Edit id={comment.id} userId={comment.userId} onUpdateComplete={handleUpdateComplete} />
              ) : (
                <>
                  <button onClick={() => setEditingCommentId(comment.id)}>수정</button>
                  <Delete commentId={comment.id} onDelete={handleDelete} />
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
