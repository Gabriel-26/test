import React, { useState, useEffect, ReactElement } from "react";
import { Input, List, Avatar } from "antd";
import FullLayout from "../../src/layouts/full/FullLayout";
import axiosInstance from "../../src/components/utils/axiosInstance";
import ResidentsList from "./residentsList";
interface Message {
  message: string;
  resident_id: string;
  currentUser: string;
}

interface Conversation {
  chatGroup_id: any;
  resident_id: string;
  // Add other properties if needed
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [showResidentsList, setShowResidentsList] = useState(false);

  const handleSelectResidents = (selectedResidents: string[]) => {
    const residentId = sessionStorage.getItem("resID");

    axiosInstance
      .post("/chatGroupUsers", {
        residents: selectedResidents,
        resident_id: residentId,
      })
      .then((response) => {
        console.log("Chat Group Created:", response.data);

        console.log("Selected Resident Data:", selectedResidents);
        // Ensure that the response contains the actual chatGroup_id
        const chatGroupId = response.data;

        console.log("chatGroupId:", chatGroupId); // Add this line

        setConversations([...conversations, { chatGroup_id: chatGroupId }]);
        setSelectedConversation(chatGroupId);
      })
      .catch((error) => {
        console.error("Error creating chat group:", error);
      })
      .finally(() => {
        setShowResidentsList(false);
      });
  };

  const toggleResidentsList = () => {
    setShowResidentsList(!showResidentsList);
  };

  useEffect(() => {
    // Retrieve first name and last name from session storage
    const firstName = sessionStorage.getItem("resFirstName") || "";
    const lastName = sessionStorage.getItem("resLastname") || "";

    // Combine first name and last name to form the full name
    const fullName = `${firstName} ${lastName}`.trim();

    // Set the full name as the current user
    setCurrentUser(fullName);
  }, []);

  const token = sessionStorage.getItem("authToken");
  // Set the token in Axios headers for this request
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const residentId = sessionStorage.getItem("resID");
    console.log("residentId:", residentId);

    // Send the message
    axiosInstance
      .post(`/chatGroupMessages`, {
        chatGroup_id: selectedConversation,
        message: inputMessage,
        resident_id: residentId,
      })
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        setMessages([
          ...messages,
          { message: inputMessage, resident_id: currentUser },
        ]);
        setInputMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const fetchMessages = () => {
    const residentId = sessionStorage.getItem("resID");

    // Fetch messages
    axiosInstance
      .get(`/chatGroupMessages/get/GroupMessages/${selectedConversation}`, {
        params: {
          chatGroup_id: selectedConversation,
          resident_id: residentId,
        },
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  useEffect(() => {
    // Fetch messages when the conversation is selected
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    axiosInstance
      .get("/chatGroup")
      .then((response) => {
        console.log("Chat Groups:", response.data); // Add this line
        setConversations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chat groups:", error);
      });
  }, []);

  const selectConversation = (resident_id: string) => {
    setSelectedConversation(resident_id);
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
              <List.Item
                onClick={() => {
                  console.log(
                    "Clicked on conversation:",
                    conversation.chatGroup_id
                  );
                  selectConversation(conversation.chatGroup_id);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={`/avatars/${conversation.chatGroup_id}.jpg`} />
                  }
                  title={<span>{conversation.chatGroup_id}</span>}
                />
              </List.Item>
            )}
          />

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
            onClick={toggleResidentsList}
          >
            Create Chat Group
          </button>
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

      {showResidentsList && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <ResidentsList
            onSelectResidents={handleSelectResidents}
            onCancel={toggleResidentsList}
          />
        </div>
      )}
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
                      message.resident_id === currentUser
                        ? "your-avatar-url"
                        : "chatmate-avatar-url"
                    }
                  />
                }
                title={currentUser}
                description={message.message}
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
            onKeyDown={(e) => {
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
