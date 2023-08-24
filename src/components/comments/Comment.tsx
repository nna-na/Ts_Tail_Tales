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
    ["comments", id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/comments?postId=${id}` // 해당 게시물의 댓글만 가져오도록 수정
      );
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

  const userNickname = sessionStorage.getItem("userNickname"); // 현재 사용자의 닉네임 가져오기

  return (
    <div>
      {deleted ? (
        <div></div>
      ) : (
        <>
          {data.map((comment: any) => (
            <div key={comment.id}>
              <div>작성자: {comment.userNickname}님</div>
              <div>{comment.date}</div>
              <div>댓글: {comment.content}</div>
              {userNickname === comment.userNickname && (
                // 사용자 닉네임과 댓글 작성자 닉네임을 비교하여 수정 및 삭제 버튼 표시
                <>
                  {editingCommentId === comment.id ? (
                    <Edit
                      id={comment.id}
                      onUpdateComplete={handleUpdateComplete}
                    />
                  ) : (
                    <>
                      <button onClick={() => setEditingCommentId(comment.id)}>
                        수정
                      </button>
                      <Delete id={comment.id} onDelete={handleDelete} />
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
