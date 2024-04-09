import React from "react";

// Function to format the created_at timestamp
const formatTimestamp = (timestamp) => {
  const currentDate = new Date();
  const messageDate = new Date(timestamp);

  // Check if the message was sent today
  if (
    currentDate.getDate() === messageDate.getDate() &&
    currentDate.getMonth() === messageDate.getMonth() &&
    currentDate.getFullYear() === messageDate.getFullYear()
  ) {
    // If it's the same day, format the timestamp to display only the time
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // If it's a different day, format the timestamp to display the day and time
    return messageDate.toLocaleString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

const MessageWithTooltip = ({ message, isCurrentUser }) => {
  // Format the timestamp
  const formattedTimestamp = formatTimestamp(message.created_at);

  // Define the CSS classes based on isCurrentUser
  const messageClass = isCurrentUser
    ? "message-text-current-user"
    : "message-text";

  return (
    <span className={messageClass} title={formattedTimestamp}>
      {message.message}
    </span>
  );
};

export default MessageWithTooltip;
