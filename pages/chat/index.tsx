import React, { useState, useEffect, ReactElement } from "react";
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
  const [Sender, setSender] = useState("");
  const [showResidentsList, setShowResidentsList] = useState(false);
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);

  const handleSelectResidents = (selectedResidents: string[]) => {
    setSelectedResidents(selectedResidents);

    axiosInstance
      .post("/chatGroupUsers", {
        resident_id: selectedResidents[0],
      })
      .then((response) => {
        console.log("Chat Group Created:", response.data);

        console.log("Selected Resident Data:", selectedResidents);
        // Ensure that the response contains the actual chatGroup_id
        const chatGroupId = response.data;

        console.log("chatGroupId:", chatGroupId); // Add this line

        setConversations([...conversations, { chatGroup_id: chatGroupId }]);
        setSelectedConversation(chatGroupId);

        // Fetch messages and update sender's name when the conversation is selected
        axiosInstance
          .get(`/chatGroupMessages/get/GroupMessages/${chatGroupId}`)
          .then((response) => {
            console.log("Response:", response.data);
            const messagesWithSender = response.data.map((message) => ({
              message: message.message,

              resident_id: message.sender.resident_id,
              resident_fName: message.sender.resident_fName,
              resident_lName: message.sender.resident_lName,

              created_at: message.created_at,
            }));

            setMessages(messagesWithSender);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });
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
  // Set the token in Axios headers for this request
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const residentId = sessionStorage.getItem("resID");
    const residentFirstName = sessionStorage.getItem("resFirstName");
    const residentLastName = sessionStorage.getItem("resLastname");

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
          {
            message: inputMessage,
            resident_id: residentId,
            resident_fName: residentFirstName,
            resident_lName: residentLastName,
          },
        ]);
        setInputMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    if (selectedConversation) {
      // Update the alignment when a conversation is selected

      // Fetch messages when the conversation is selected
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(
            `/chatGroupMessages/get/GroupMessages/${selectedConversation}`
          );

          const messagesWithSender = response.data.map((message) => ({
            message: message.message,
            resident_id: message.sender.resident_id,
            resident_fName: message.sender.resident_fName,
            resident_lName: message.sender.resident_lName,

            created_at: message.created_at,
          }));

          setMessages(messagesWithSender);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  // useEffect(() => {
  //   // Fetch messages and update sender's name when the conversation is selected
  //   const fetchMessagesAndSender = async () => {
  //     if (selectedConversation) {
  //       try {
  //         const response = await axiosInstance.get(
  //           `/chatGroupMessages/get/GroupMessages/${selectedConversation}`
  //         );

  //         console.log("Response:", response.data);
  //         const messagesWithSender = response.data.map((message) => ({
  //           message: message.message,
  //           sender: {
  //             resident_id: message.sender.resident_id,
  //             resident_fName: message.sender.resident_fName,
  //             resident_lName: message.sender.resident_lName,
  //           },
  //           created_at: message.created_at,
  //         }));

  //         if (messagesWithSender.length > 0) {
  //           // Update the Sender based on the latest message
  //           setSender(
  //             messagesWithSender[messagesWithSender.length - 1].sender
  //               .resident_id
  //           );
  //         }

  //         setMessages(messagesWithSender);
  //       } catch (error) {
  //         console.error("Error fetching messages:", error);
  //       }
  //     }
  //   };

  //   fetchMessagesAndSender();
  // }, [selectedConversation, messages]); // Include messages as a dependency

  useEffect(() => {
    axiosInstance
      .get("chatGroupUsers/{chatGroupId}/residents/{residentId}")
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
    <div className="flex flex-col h-full">
      <div className="p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">Chat Home</h1>
      </div>
      <div className="flex p-4 h-full">
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
  inputMessage: string;
  handleSendMessage: () => void;
  setInputMessage: (value: string) => void;
}> = ({
  selectedConversation,
  messages,
  inputMessage,
  handleSendMessage,
  setInputMessage,
}) => {
  const currentUserFirstName = sessionStorage.getItem("resFirstName");
  const currentUserLastName = sessionStorage.getItem("resLastname");

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">{selectedConversation}</h1>
      </div>
      <div
        className="flex-grow p-4 overflow-y-auto"
        style={{ maxHeight: "500px" }}
      >
        {/* Adjust the maxHeight value based on your design */}
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
                  marginBottom: "8px", // Adjust the margin as needed
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
            style={{ flex: 1, marginRight: "8px" }} // Adjust the styles
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
