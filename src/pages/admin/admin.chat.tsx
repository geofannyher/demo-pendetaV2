// import { useEffect, useRef, useState } from "react";
// import { chatAdmin } from "../../services/api/chat.services";
// import { getSession } from "../../shared/Session";
// import { AdminHIstoryChat } from "../../components/chat";
// import LoadingComponent from "../../components/loader";

// const AdminChat = () => {
//   const messagesEndRef = useRef<null | HTMLDivElement>(null);
//   const [history, setHistory] = useState<string>("");
//   const [content, setContent] = useState<string>("");
//   const idUser = getSession();

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       if (
//         "scrollBehavior" in document.documentElement.style &&
//         window.innerWidth > 768
//       ) {
//         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//       } else {
//         messagesEndRef.current.scrollIntoView();
//       }
//     }
//   };

//   const getHistory = async () => {
//     const res: any = await chatAdmin({
//       id: idUser ? idUser : "",
//       star: "pdteras",
//     });
//     if (res?.data?.data) {
//       setHistory(res?.data?.data?.history[1]?.content);
//       setContent(res?.data?.data?.history[2]?.content);
//     }
//   };
//   const fetchData = async () => {
//     await getHistory();
//     scrollToBottom();
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="flex h-[dvh] lg:h-screen md:h-screen flex-col bg-white">
//       <div className="container mx-auto p-4">
//         <h3 className="font-semibold">History Admin</h3>
//       </div>
//       <div className="hide-scrollbar container mx-auto flex-1 space-y-2 overflow-y-auto p-4">
//         {history && content ? (
//           <>
//             <AdminHIstoryChat message={`${content}${history}`} />
//             <div ref={messagesEndRef} />
//           </>
//         ) : (
//           <>
//             <LoadingComponent />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminChat;

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabase/connection";

const AdminChat = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("chat")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setChatHistory(data);
      }
    } catch (error: any) {
      console.error("Error fetching chat history:", error.message);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []); // Panggil fetchChatHistory saat komponen dimuat

  useEffect(() => {
    scrollToBottom(); // Panggil scrollToBottom setelah chat history diperbarui
  }, [chatHistory]); // Panggil saat chatHistory berubah

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const filteredChatHistory = chatHistory.filter((message) =>
    message.text.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
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
        {filteredChatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={` p-2 rounded-lg ${
                message.sender === "user"
                  ? "mr-2 bg-gray-100"
                  : "ml-2 bg-gray-300"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {filteredChatHistory.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            Tidak ada hasil chat yang cocok.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default AdminChat;
