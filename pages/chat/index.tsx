import React, { useState, useEffect, useRef } from "react";
import { List, Avatar, Modal, Button } from "antd";
import FullLayout from "../../src/layouts/full/FullLayout";
import axiosInstance from "../../src/components/utils/axiosInstance";
import ResidentsList from "./residentsList";
import { TextareaAutosize } from "@mui/material";
import { useRouter } from "next/router";
import PatientListPage from "./patientList";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const clearSelectedPatients = () => {
    setSelectedPatients([]);
  };

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

  const handleSelectPatients = (selectedPatients: string[]) => {
    setSelectedPatients(selectedPatients);
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

  const token = localStorage.getItem("authToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const residentId = localStorage.getItem("resID");
    const residentFirstName = localStorage.getItem("resFirstName");
    const residentLastName = localStorage.getItem("resLastname");

    // Check if there are selected patients
    const hasSelectedPatients = selectedPatients.length > 0;

    // Construct the message
    let messageContent = inputMessage;

    if (hasSelectedPatients) {
      // Use the first selected patient ID to generate the link
      const patientId = selectedPatients[0];
      const patientLink = generateShareLinks([patientId]);
      // Append patient link to the message
      messageContent;
    }

    axiosInstance
      .post(`/chatGroupMessages`, {
        chatGroup_id: selectedConversation,
        message: messageContent,
        resident_id: residentId,
      })
      .then((response) => {
        const newMessage: Message = {
          chatGroupMessages_id: response.data.chatGroupMessages_id,
          message: messageContent,
          resident_id: residentId,
          resident_fName: residentFirstName,
          resident_lName: residentLastName,
        };

        setMessages([...messages, newMessage]);
        setInputMessage(""); // Clear the input message if needed, remove if not
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const selectConversation = (resident_id: string) => {
    setSelectedConversation(resident_id);
  };

  const handleSharePatientHistory = () => {
    setModalVisible(true);
  };

  const handleConfirmShare = () => {
    // Handle confirmation and generate links here
    const links = generateShareLinks(selectedPatients);
    console.log("Share Links:", links);

    // Create messages for each patient with their respective link
    const messages = links.map(
      (link, index) => `Patient ${selectedPatients[index]}: ${link}`
    );

    // Preserve the existing content of inputMessage and append the new messages
    setInputMessage((prevInputMessage) => {
      return prevInputMessage + " " + messages.join(" ");
    });

    // Close the modal
    setModalVisible(false);

    // Clear selected patients after sharing
    clearSelectedPatients();
  };

  const generateShareLinks = (selectedPatients: string[]): string[] => {
    // Implement your logic to generate a share link for each patient
    const patientLinks = selectedPatients.map(
      (patientId) => `/patients/${patientId}`
    );
    return patientLinks;
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">Chat Home</h1>
      </div>
      <div className="flex p-4 h-full">
        <div className="w-1/3">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <List
            dataSource={conversations || []}
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
        <div className="w-full">
          {selectedConversation ? (
            <ChatWithChatmate
              selectedConversation={selectedConversation}
              messages={messages}
              inputMessage={inputMessage}
              handleSendMessage={handleSendMessage}
              setInputMessage={setInputMessage}
              conversations={conversations}
              handleSharePatientHistory={handleSharePatientHistory}
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
      {/* Patient List Modal */}
      <Modal
        title="Select Patients to Share"
        open={modalVisible}
        onOk={handleConfirmShare}
        onCancel={() => {
          // Clear selected patients when the modal is closed
          clearSelectedPatients();
          setModalVisible(false);
        }}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="share"
            type="primary"
            onClick={handleConfirmShare}
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
          >
            Share
          </Button>,
        ]}
      >
        {/* Pass handleSelectPatients function to PatientListPage */}
        <PatientListPage onSelectPatients={handleSelectPatients} />
      </Modal>
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
  handleSharePatientHistory: () => void;
}> = ({
  selectedConversation,
  messages,
  inputMessage,
  handleSendMessage,
  setInputMessage,
  conversations,
  handleSharePatientHistory,
}) => {
  const messagesEndRef = useRef(null);
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastReceivedMessageId, setLastReceivedMessageId] = useState<
    string | null
  >(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if there's a new incoming message
    const lastMessage = messages[messages.length - 1];
    const isCurrentUser =
      lastMessage?.resident_id === localStorage.getItem("resID");

    if (
      !isCurrentUser &&
      lastReceivedMessageId !== lastMessage?.chatGroupMessages_id
    ) {
      // Display a notification for new incoming messages
      setIsNewMessage(true);
      setLastReceivedMessageId(lastMessage?.chatGroupMessages_id || null);

      // Clear the notification after 3 seconds
      const timeoutId = setTimeout(() => {
        setNotification(null);
        setIsNewMessage(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, selectedConversation, lastReceivedMessageId]);

  // useEffect(() => {
  //   // Display notification and clear after 3 seconds
  //   if (isNewMessage) {
  //     setNotification("New message received");
  //     const timeoutId = setTimeout(() => {
  //       setNotification(null);
  //       setIsNewMessage(false);
  //     }, 3000);

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [isNewMessage, selectedConversation]);

  const currentUserFirstName = localStorage.getItem("resFirstName");
  const currentUserLastName = localStorage.getItem("resLastname");

  const currentConversation = conversations?.find(
    (conversation) => conversation.chatGroup_id === selectedConversation
  );

  const otherResidentFirstName =
    currentConversation?.other_resident_fName || "Other ";
  const otherResidentLastName =
    currentConversation?.other_resident_lName || "Resident";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between p-2 bg-blue-500 text-white">
        <h1 className="text-xl font-semibold">
          {`${otherResidentFirstName} ${otherResidentLastName}`}
        </h1>
      </div>
      {notification && (
        <div className="p-2 bg-yellow-400 text-white">
          <p className="text-sm">{notification}</p>
        </div>
      )}
      <div
        className="flex-grow p-4"
        style={{ height: "612px", overflowY: "auto" }}
      >
        <List
          dataSource={messages}
          renderItem={(message, index) => {
            const isCurrentUser =
              message.resident_id === localStorage.getItem("resID");
            const messageAlignment = isCurrentUser ? "right" : "left";
            const patientLinkRegex = /Patient (\w+): (\S+)/g;
            let matches = [];
            let match;

            // Use a loop to find all matches in the message
            while ((match = patientLinkRegex.exec(message.message)) !== null) {
              const patientId = match[1];
              const patientLink = match[2];

              matches.push({
                patientId,
                patientLink,
                start: match.index,
                end: match.index + match[0].length,
              });
            }

            // If matches found, render the message with patient links
            if (matches.length > 0) {
              const messageParts = [];
              let lastIndex = 0;

              matches.forEach((match, matchIndex) => {
                // Add the text before the match
                const beforeText = message.message.substring(
                  lastIndex,
                  match.start
                );
                messageParts.push(
                  <span key={`before_${matchIndex}`}>{beforeText}</span>
                );

                // Add the patient link
                messageParts.push(
                  <a
                    key={`link_${matchIndex}`}
                    href={match.patientLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{`Patient ${match.patientId}`}</a>
                );

                // Update the lastIndex
                lastIndex = match.end;
              });

              // Add the text after the last match
              const afterText = message.message.substring(lastIndex);
              messageParts.push(
                <span key={`after_${matches.length}`}>{afterText}</span>
              );

              return (
                <List.Item
                  key={index}
                  style={{
                    textAlign: messageAlignment,
                    marginBottom: "8px",
                    wordWrap: "break-word", // Ensure long words are broken

                
                  }}
                >
                  <List.Item.Meta
                    title={
                      isCurrentUser
                        ? `${currentUserFirstName} ${currentUserLastName}`
                        : `${message.resident_fName} ${message.resident_lName}`
                    }
                    description={messageParts}
                  />
                </List.Item>
              );
            } else {
              // If no matches found, render the message without a link
              return (
                <List.Item
                  key={index}
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
            }
          }}
        />
        {isNewMessage && <div ref={messagesEndRef} />}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-4">
          <TextareaAutosize
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            style={{
              width: "calc(100% - 120px)", // Adjust the width as needed
              resize: "none", // Disable resizing
              border: "1px solid #ccc", // Add border
              borderRadius: "4px", // Add border radius for a rounded appearance
              padding: "8px", // Add padding for better spacing
            }}
          />

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={handleSendMessage}
          >
            Send
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={handleSharePatientHistory}
          >
            Share Patient History
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
