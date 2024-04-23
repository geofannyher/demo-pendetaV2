// import React, { useState, useEffect, useRef } from "react";
// import { IoIosSend } from "react-icons/io";
// import { notification } from "antd";
// import { IMessage } from "../utils/interface/chat.interface";
// import { AiChat, UserChat } from "../components/chat";
// import Navbar from "../components/navbar";
// import { chatResNew } from "../services/api/chat.services";
// import notificationSound from "../assets/notif.mp3";

// const ChatPage: React.FC = () => {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [api, context] = notification.useNotification();
//   const [finalMsg, setfinalMsg] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);
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

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     const audio = new Audio(notificationSound);
//     audio.play();

//     event.preventDefault();
//     const messageInput = event.currentTarget.message.value.trim();

//     if (!messageInput) {
//       return api.error({ message: "Kolom pesan tidak boleh kosong" });
//     }

//     // Menambahkan pesan pengguna ke dalam daftar messages dengan status "user"
//     const userMessage: IMessage = { text: messageInput, sender: "user" };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     event.currentTarget.reset(); // Mengosongkan input setelah mengirim pesan

//     try {
//       // Kirim permintaan ke API chat untuk mendapatkan respons
//       const response: any = await chatResNew({
//         id: "1",
//         message: messageInput,
//         model: "gpt-4-turbo",
//         star: "pdteras",
//         is_rag: "true",
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let currentBotMessage = ""; // Variabel untuk menyimpan pesan AI yang sedang terbentuk

//       // Loop untuk membaca data streaming dari respons
//       while (true) {
//         const { value, done } = await reader.read();

//         console.log(done);
//         if (done) {
//           // Simpan finalBotMessage setelah keluar dari loop
//           break;
//         }

//         const chunk = decoder.decode(value); // Mendekode blok data menjadi teks UTF-8
//         const messagesFromChunk = chunk.split("\n");

//         // Loop untuk memproses setiap pesan yang diterima
//         for (const message of messagesFromChunk) {
//           if (message.startsWith("data: ")) {
//             const jsonMessage = message.substring("data: ".length);

//             try {
//               if (message.startsWith("data: [DONE]")) {
//                 setfinalMsg(currentBotMessage);
//                 return;
//               } else {
//                 const parsedMessage = JSON.parse(jsonMessage);

//                 if (parsedMessage.choices && parsedMessage.choices.length > 0) {
//                   const content = parsedMessage.choices
//                     .map((choice: any) => choice?.delta?.content)
//                     .join(""); // Menggabungkan konten pesan AI

//                   // Tambahkan konten pesan AI yang sedang terbentuk ke dalam pesan AI yang ada
//                   currentBotMessage += content;

//                   // Update pesan AI secara real-time saat sedang terbentuk
//                   setMessages((prevMessages) => {
//                     const updatedMessages = [...prevMessages];
//                     if (
//                       updatedMessages.length > 0 &&
//                       updatedMessages[updatedMessages.length - 1].sender ===
//                         "ai"
//                     ) {
//                       // Jika pesan sebelumnya adalah pesan AI yang sedang terbentuk, perbarui isi pesan tersebut
//                       updatedMessages[updatedMessages.length - 1].text =
//                         currentBotMessage;
//                     } else {
//                       // Jika tidak, tambahkan pesan AI baru ke dalam messages
//                       const botMessage: IMessage = {
//                         text: currentBotMessage,
//                         sender: "ai",
//                       };
//                       updatedMessages.push(botMessage);
//                     }
//                     return updatedMessages;
//                   });

//                   scrollToBottom(); // Scroll ke bawah saat ada pembaruan pesan AI
//                 }
//               }
//             } catch (error) {
//               console.error("Error parsing JSON message:", error);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }

//     audio.play();
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       setMessages([
//         {
//           text: "Shalom, mari kita tumbuh bersama dalam memahami kebesaran dan kasih Allah kepada kita. Apakah saudara memiliki pertanyaan atau ingin mendalami lebih jauh tentang Kenosis, Logos, dan Monotheisme?",
//           sender: "ai",
//         },
//       ]);
//     }, 700);
//   }, []);
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   return (
//     <div className="flex h-[100dvh] flex-col bg-white">
//       <Navbar />
//       {context}
//       <div className="container hide-scrollbar mx-auto flex-1 space-y-2 overflow-y-auto p-4">
//         {messages.map((message, index) => (
//           <div key={index}>
//             {message.sender === "user" ? (
//               <div>
//                 <UserChat message={message.text} />
//                 <div ref={messagesEndRef} />
//               </div>
//             ) : (
//               <div>
//                 <div ref={messagesEndRef} />
//                 <AiChat
//                   message={message.text}
//                   audioUrl={finalMsg}
//                   isLastAIChat={index === messages.length - 1}
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="w-full p-4 shadow-sm container mx-auto">
//         <form onSubmit={handleSubmit}>
//           <div className="relative">
//             <input
//               type="text"
//               id="message"
//               name="message"
//               className="block w-full pr-20 rounded-xl border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900"
//               placeholder="Masukkan pesan anda.."
//             />
//             <button
//               type="submit"
//               className="absolute bottom-2.5 end-2.5 rounded-lg bg-mainColor px-4 py-2 text-sm font-medium text-white shadow-md transition duration-300 hover:bg-hoverBtn"
//             >
//               <IoIosSend />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

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

  const getRandomID = async () => {
    const idUser = await generateRandomString();
    localStorage.setItem("idPendeta", idUser);
  };
  const checkAIResponse = async () => {
    const aiMessages = messages.filter((message) => message.sender === "ai");
    if (aiMessages.length > 2) {
      getRandomID();
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
    checkAIResponse();
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
      star: "pdteras",
      id: idUserSession ? idUserSession : "",
      model: "gpt-4-turbo",
      is_rag: "true",
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
    <div className="flex h-[100dvh] lg:h-screen md:h-screen flex-col bg-white">
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
