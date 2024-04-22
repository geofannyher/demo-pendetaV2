import React, { useState, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import notificationSound from "../assets/notif.mp3";
import { notification } from "antd";
import { IMessage } from "../utils/interface/chat.interface";
import {
  chatResNew,
  generateRandomString,
} from "../services/api/chat.services";
import { AiChat, UserChat } from "../components/chat";
import LoadingComponent from "../components/loader";
import Navbar from "../components/navbar";
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [api, context] = notification.useNotification();
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      if (
        "scrollBehavior" in document.documentElement.style &&
        window.innerWidth > 768
      ) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        messagesEndRef.current.scrollIntoView();
      }
    }
  };

  const idUserSession = localStorage.getItem("idPendeta");
  const randomChar = async () => {
    if (idUserSession === null) {
      const res = await generateRandomString();
      localStorage.setItem("idPendeta", res);
    }
  };

  useEffect(() => {
    randomChar();
    setTimeout(() => {
      setMessages([
        {
          text: "Shalom, mari kita tumbuh bersama dalam memahami kebesaran dan kasih Allah kepada kita. Apakah saudara memiliki pertanyaan atau ingin mendalami lebih jauh tentang Kenosis, Logos, dan Monotheisme?",
          sender: "ai",
        },
      ]);
    }, 700);
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleForm = async (event: any) => {
    event.preventDefault();
    const messageInput = event?.target[0]?.value.trim();
    event.target[0].value = "";

    if (!messageInput) {
      return api.error({ message: "Kolom pesan tidak boleh kosong" });
    }
    const userMessage = { text: messageInput, sender: "user" };
    const loadingMessage = { isLoading: true };

    setMessages((prevMessages: any) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    const audio = new Audio(notificationSound);
    audio.play();

    const resNew: any = await chatResNew({
      message: messageInput,
      star: "pdteras2 ",
      id: idUserSession ? idUserSession : "",
      model: "gpt-4-turbo-preview",
      is_rag: "false",
    });

    if (resNew && resNew?.data?.data) {
      setMessages((prevMessages: any) => {
        return [
          ...prevMessages.filter((m: any) => !m.isLoading),
          { text: resNew?.data?.data || "AI tidak merespon", sender: "ai" },
        ];
      });
      const audio = new Audio(notificationSound);
      audio.play();
    }
  };

  return (
    <div className="flex h-[93vh] lg:h-screen md:h-screen flex-col bg-white">
      <Navbar />
      {context}
      <div className="hide-scrollbar container mx-auto flex-1 space-y-2 overflow-y-auto p-4 ">
        {messages.map((message, index) =>
          message?.isLoading ? (
            <>
              <LoadingComponent key={index} />
              <div ref={messagesEndRef} />
            </>
          ) : message?.sender === "user" ? (
            <div key={index}>
              <UserChat message={message?.text} />
            </div>
          ) : (
            <div key={index}>
              <AiChat
                message={message?.text}
                isLastAIChat={index === messages.length - 1}
              />
              <div ref={messagesEndRef} />
            </div>
          )
        )}
      </div>
      <div className=" container mx-auto w-full p-4 shadow-sm">
        <form onSubmit={handleForm}>
          <div className="relative">
            <input
              type="text"
              id="message"
              name="message"
              className="block w-full pr-20 rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900"
              placeholder="Masukkan pesan anda.."
            />
            <button
              type="submit"
              className="absolute bottom-2.5 end-2.5 rounded-lg bg-mainColor px-4 py-2 text-sm font-medium text-white shadow-md transition duration-300 hover:bg-hoverBtn"
            >
              <IoIosSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
