import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LuArrowDown } from "react-icons/lu";
import { getIdSession } from "../../services/supabase/session.service";
import { notification } from "antd";

const AdminChat = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [api, context] = notification.useNotification();

  const getIdUser = async () => {
    const resses = await getIdSession();
    if (resses?.status == 200) {
      fetchChatHistory(resses?.data?.localidV2);
    } else {
      api.error({ message: "Gagal mendapatkan id user" });
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      if (
        "scrollBehavior" in document.documentElement.style &&
        window.innerWidth > 768
      ) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const fetchChatHistory = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.post(import.meta.env.VITE_APP_CHATT + "history", {
        id: id,
        star: "pdteras2",
      });

      const konteksMessage = res?.data?.data?.history[1]?.content;

      const userMessages = res.data.data.coversation?.user.map(
        (message: string, index: number) => ({
          sender: "user",
          message,
          index,
        })
      );
      const aiMessages = res.data.data.coversation?.ai.map(
        (message: string, index: number) => ({
          sender: "ai",
          message,
          konteksMessage:
            index === res.data.data.coversation?.ai.length - 1 &&
            konteksMessage,
          index,
        })
      );

      // Gabungkan pesan user dan pesan AI ke dalam satu array
      const newConversation = [...userMessages, ...aiMessages];

      newConversation.sort((a, b) => a.index - b.index);

      setChatHistory(newConversation);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching chat history:", error.message);
    }
  };

  useEffect(() => {
    getIdUser();
  }, []); // Panggil fetchChatHistory saat komponen dimuat

  useEffect(() => {
    scrollToBottom(); // Panggil scrollToBottom setelah chat history diperbarui
  }, [chatHistory]); // Panggil saat chatHistory berubah

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const renderHighlightedText = (text: string) => {
    if (!searchKeyword.trim()) return text; // Jika kata kunci pencarian kosong, kembalikan teks asli

    const regex = new RegExp(`(${searchKeyword.trim()})`, "gi"); // Buat ekspresi reguler dari kata kunci pencarian (global dan case-insensitive)
    const parts = text.split(regex); // Pisahkan teks berdasarkan kata kunci pencarian

    return parts.map((part, index) => {
      if (regex.test(part)) {
        // Bagian ini adalah bagian teks yang cocok dengan kata kunci (disorot)
        return (
          <span key={index} className="bg-yellow-200 border p-1">
            {part}
          </span>
        );
      } else {
        // Bagian ini adalah bagian teks asli (tidak cocok dengan kata kunci)
        return <span key={index}>{part}</span>;
      }
    });
  };

  const filteredChatHistory = chatHistory.filter((message) =>
    message.message.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      {context}
      <div className="container mx-auto p-4">
        <h3 className="font-semibold">History Admin</h3>
        <input
          type="text"
          value={searchKeyword}
          onChange={handleSearch}
          placeholder="Cari chat..."
          className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
        />
      </div>
      <div className="hide-scrollbar container mx-auto flex-1 space-y-2 overflow-y-auto p-4">
        {loading ? (
          <p className="text-gray-500 text-center mt-4">Loading...</p>
        ) : filteredChatHistory.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            Tidak ada hasil chat yang cocok.
          </p>
        ) : (
          filteredChatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.sender === "user" ? "mr-2" : "ml-2"
                } bg-gray-300`}
              >
                {renderHighlightedText(message.message)}
                <div className="text-sm font-semibold">
                  {message?.konteksMessage &&
                    `KONTEKS : ${message?.konteksMessage}`}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <button
        onClick={scrollToBottom}
        className="fixed bottom-10 right-10 bg-[#5751c8] hover:bg-[#5751c8] transition duration-500 hover:scale-105 text-white px-4 py-2 rounded-full shadow-lg"
      >
        <LuArrowDown />
      </button>
    </div>
  );
};

export default AdminChat;
