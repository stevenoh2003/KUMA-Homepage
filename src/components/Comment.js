import React from "react"

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-author">
        <img
          src={comment.author.profilePicUrl || "/default-profile.png"}
          alt={comment.author.name}
        />
        <p>{comment.author.name}</p>
      </div>
      <p>{comment.content}</p>
      <small>{new Date(comment.createdAt).toLocaleString()}</small>
    </div>
  )
}

export default Comment
