import React, { useState, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { notification } from "antd";
import { IMessage } from "../utils/interface/chat.interface";
import { AiChat, UserChat } from "../components/chat";
import Navbar from "../components/navbar";
import LoadingComponent from "../components/loader";
import { supabase } from "../services/supabase/connection";
import { getIdSession } from "../services/supabase/session.service";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [api, context] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [idUserSession, setId] = useState("");
  const [audioText, setAdioText] = useState("");
  // const idUserSession = localStorage.getItem("idPendeta");

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

  const getIdUser = async () => {
    const resses = await getIdSession();
    if (resses?.status == 200) {
      setId(resses?.data?.localidV2);
    } else {
      return api.error({ message: "Gagal mendapatkan id user" });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          text: "Shalom, mari kita tumbuh bersama dalam memahami kebesaran dan kasih Allah kepada kita. Apakah saudara memiliki pertanyaan atau ingin mendalami lebih jauh tentang Kenosis, Logos, dan Monotheisme?",
          sender: "ai",
        },
      ]);
    }, 700);
    getIdUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageInput = event.currentTarget.message.value.trim();

    if (!messageInput) {
      return api.error({ message: "Kolom pesan tidak boleh kosong" });
    }

    setIsLoading(true);
    // Menambahkan pesan pengguna ke dalam daftar messages dengan status "user"
    const userMessage: IMessage = { text: messageInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    event.currentTarget.reset(); // Mengosongkan input setelah mengirim pesan

    try {
      // Kirim permintaan ke API chat untuk mendapatkan respons
      const response: any = await fetch(
        `${import.meta.env.VITE_APP_CHATT}achat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            star: "pdteras",
            model: "gpt-4-turbo-preview",
            temperature: 1,
            id: idUserSession,
            message: messageInput,
            chat_limit: 1,
            is_rag: "false",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentBotMessage = ""; // Variabel untuk menyimpan pesan AI yang sedang terbentuk

      // Loop untuk membaca data streaming dari respons
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value); // Mendekode blok data menjadi teks UTF-8
        const messages = chunk.split("\n");

        // Loop untuk memproses setiap pesan yang diterima
        for (const message of messages) {
          if (message.startsWith("data: ")) {
            const jsonMessage = message.substring("data: ".length);

            try {
              const parsedMessage = JSON.parse(jsonMessage);

              if (parsedMessage.choices && parsedMessage.choices.length > 0) {
                const content = parsedMessage.choices
                  .map((choice: any) => choice?.delta?.content)
                  .join(""); // Menggabungkan konten pesan AI

                // Menambahkan bagian pesan AI yang terbentuk ke dalam variabel currentBotMessage
                currentBotMessage += content;
                scrollToBottom();
              }
            } catch (error) {
              console.error("Error parsing JSON message:", error);
            }
          }
        }
      }

      await supabase.from("chat").upsert([
        {
          id_user: 4,
          text: messageInput,
          sender: "user",
        },
        {
          id_user: 4,
          text: currentBotMessage || "AI tidak merespon",
          sender: "ai",
        },
      ]);

      // Setelah semua pesan AI terbentuk, tambahkan pesan AI ke dalam daftar messages
      if (currentBotMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: currentBotMessage, sender: "ai" },
        ]);
      }
      setAdioText(currentBotMessage);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      {context}
      <div className="container hide-scrollbar mx-auto flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index}>
            {message.sender === "user" ? (
              <UserChat message={message.text} />
            ) : (
              <AiChat
                message={message.text}
                audioUrl={audioText}
                isLastAIChat={index === messages.length - 1}
              />
            )}
          </div>
        ))}
        {isLoading && <LoadingComponent />}{" "}
        {/* Tampilkan LoadingComponent jika isLoading true */}
        <div ref={messagesEndRef} />
      </div>
      <div className="container mx-auto w-full p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
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
