import React, { useState, useEffect } from "react";
import { Input, List, Avatar } from "antd";
import FullLayout from "../../src/layouts/full/FullLayout";
import axiosInstance from "../../src/components/utils/axiosInstance";
import ResidentsList from "./residentsList";

interface Message {
  chatGroupMessages_id: string;
  message: string;
  resident_fName: string;
  resident_lName: string;
  resident_id: string;
}

interface Conversation {
  other_resident_fName: React.ReactNode;
  other_resident_lName: React.ReactNode;
  chatGroup_id: any;
  resident_id: string;
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showResidentsList, setShowResidentsList] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timer | null>(null);

  const fetchChatGroups = async () => {
    try {
      const response = await axiosInstance.get("chatGroupUsers/get/allGroups");
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching chat groups:", error);
    }
  };

  const fetchData = async (selectedConversation: string | null) => {
    try {
      if (selectedConversation) {
        const messagesResponse = await axiosInstance.get(
          `/chatGroupMessages/get/GroupMessages/${selectedConversation}`
        );

        const messagesWithSender = messagesResponse.data.map(
          (message: any) => ({
            message: message.message,
            resident_id: message.sender.resident_id,
            resident_fName: message.sender.resident_fName,
            resident_lName: message.sender.resident_lName,
            created_at: message.created_at,
          })
        );

        setMessages(messagesWithSender);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectResidents = (selectedResidents: string[]) => {
    axiosInstance
      .post("/chatGroupUsers", {
        resident_id: selectedResidents[0],
      })
      .then((response) => {
        const chatGroups = response.data.chatGroups || [];

        setConversations((prevConversations) => {
          const existingChatGroupIds = new Set(
            prevConversations.map((chatGroup) => chatGroup.chatGroup_id)
          );

          const updatedConversations = [
            ...prevConversations,
            ...chatGroups.filter(
              (newChatGroup) =>
                !existingChatGroupIds.has(newChatGroup.chatGroup_id)
            ),
          ];

          return updatedConversations;
        });

        setSelectedConversation((prevSelectedConversation) => {
          const newSelectedConversation =
            prevSelectedConversation ||
            (chatGroups.length > 0 ? chatGroups[0].chatGroup_id : null);

          fetchData(newSelectedConversation);
          return newSelectedConversation;
        });

        // Clear the previous polling interval
        if (pollInterval) {
          clearInterval(pollInterval);
        }

        // Setup polling for the selected conversation
        const newPollInterval = setInterval(() => {
          fetchData(selectedConversation);
        }, 10000);
        setPollInterval(newPollInterval);

        // Fetch updated chat groups
        fetchChatGroups(); // <-- Call the function here
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

  const token = sessionStorage.getItem("authToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const residentId = sessionStorage.getItem("resID");
    const residentFirstName = sessionStorage.getItem("resFirstName");
    const residentLastName = sessionStorage.getItem("resLastname");

    axiosInstance
      .post(`/chatGroupMessages`, {
        chatGroup_id: selectedConversation,
        message: inputMessage,
        resident_id: residentId,
      })
      .then((response) => {
        const newMessage: Message = {
          chatGroupMessages_id: response.data.chatGroupMessages_id,
          message: inputMessage,
          resident_id: residentId,
          resident_fName: residentFirstName,
          resident_lName: residentLastName,
        };

        setMessages([...messages, newMessage]);
        setInputMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    // Fetch chat groups when the component mounts
    fetchChatGroups();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Setup polling for the selected conversation
      const intervalId = setInterval(() => {
        fetchData(selectedConversation);
      }, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [selectedConversation]);

  const selectConversation = (resident_id: string) => {
    setSelectedConversation(resident_id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">Chat Home</h1>
      </div>
      <div className="flex p-4 h-full">
        <div className="w-1/3">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <List
            dataSource={conversations}
            style={{ maxHeight: "680px", overflowY: "auto" }}
            renderItem={(conversation, index) => (
              <List.Item
                onClick={() => {
                  selectConversation(conversation.chatGroup_id);
                }}
                className={`${
                  selectedConversation === conversation.chatGroup_id
                    ? "bg-gray-200 cursor-pointer transition-colors duration-300"
                    : "cursor-pointer"
                }`}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar>{conversation.other_resident_fName[0]}</Avatar>
                  }
                  title={
                    <span>
                      {conversation.other_resident_fName}{" "}
                      {conversation.other_resident_lName}
                    </span>
                  }
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
              inputMessage={inputMessage}
              handleSendMessage={handleSendMessage}
              setInputMessage={setInputMessage}
              conversations={conversations}
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
  inputMessage: string;
  handleSendMessage: () => void;
  setInputMessage: (value: string) => void;
  conversations: Conversation[];
}> = ({
  selectedConversation,
  messages,
  inputMessage,
  handleSendMessage,
  setInputMessage,
  conversations,
}) => {
  const currentUserFirstName = sessionStorage.getItem("resFirstName");
  const currentUserLastName = sessionStorage.getItem("resLastname");

  const currentConversation = conversations?.find(
    (conversation) => conversation.chatGroup_id === selectedConversation
  );

  const otherResidentFirstName =
    currentConversation?.other_resident_fName || "Other Resident";
  const otherResidentLastName = currentConversation?.other_resident_lName || "";

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">
          {`${otherResidentFirstName} ${otherResidentLastName}`}
        </h1>
      </div>
      <div
        className="flex-grow p-4 overflow-y-auto"
        style={{ maxHeight: "500px" }}
      >
        <List
          dataSource={messages}
          renderItem={(message, index) => {
            const isCurrentUser =
              message.resident_id === sessionStorage.getItem("resID");
            const messageAlignment = isCurrentUser ? "right" : "left";

            return (
              <List.Item
                style={{
                  textAlign: messageAlignment,
                  marginBottom: "8px",
                }}
              >
                <List.Item.Meta
                  title={
                    isCurrentUser
                      ? `${currentUserFirstName} ${currentUserLastName}`
                      : `${message.resident_fName} ${message.resident_lName}`
                  }
                  description={message.message}
                />
              </List.Item>
            );
          }}
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
            style={{ flex: 1, marginRight: "8px" }}
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

(ChatPage as any).getLayout = function getLayout(page: React.ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default ChatPage;
