import React, { useState, useEffect } from "react";
import { Input, List, Avatar } from "antd";
import FullLayout from "../../src/layouts/full/FullLayout";
import axiosInstance from "../../src/components/utils/axiosInstance";

interface Message {
  text: string;
  user: string;
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("User");

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    axiosInstance
      .post(`/chatGroupMessages`, {
        chatGroup_id: selectedConversation,
        message: inputMessage,
      })
      .then((response) => {
        setMessages([...messages, { text: inputMessage, user: currentUser }]);
        setInputMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    axiosInstance
      .get("/chatGroup")
      .then((response) => {
        setConversations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chat groups:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      axiosInstance
        .get(`/chatGroupMessages/get/GroupMessages/${selectedConversation}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [selectedConversation]);

  const selectConversation = (user: string) => {
    setSelectedConversation(user);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">Chat Home</h1>
      </div>
      <div className="flex p-4">
        <div className="w-1/3">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <List
            dataSource={conversations}
            renderItem={(conversation, index) => (
              <List.Item onClick={() => selectConversation(conversation.user)}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`/avatars/${conversation.user.toLowerCase()}.jpg`}
                    />
                  }
                  title={conversation.user}
                />
              </List.Item>
            )}
          />
        </div>
        <div className="w-2/3">
          {selectedConversation ? (
            <ChatWithChatmate
              selectedConversation={selectedConversation}
              messages={messages}
              currentUser={currentUser}
              inputMessage={inputMessage}
              handleSendMessage={handleSendMessage}
              setInputMessage={setInputMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWithChatmate: React.FC<{
  selectedConversation: string;
  messages: Message[];
  currentUser: string;
  inputMessage: string;
  handleSendMessage: () => void;
  setInputMessage: (value: string) => void;
}> = ({
  selectedConversation,
  messages,
  currentUser,
  inputMessage,
  handleSendMessage,
  setInputMessage,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">{selectedConversation}</h1>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <List
          dataSource={messages}
          renderItem={(message, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      message.user === currentUser
                        ? "your-avatar-url"
                        : "chatmate-avatar-url"
                    }
                  />
                }
                title={message.user}
                description={message.text}
              />
            </List.Item>
          )}
        />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
ChatPage.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
