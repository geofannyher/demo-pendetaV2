import { useEffect, useRef, useState } from "react";
import { chatAdmin } from "../../services/api/chat.services";
import { getSession } from "../../shared/Session";
import { AdminHIstoryChat } from "../../components/chat";
import LoadingComponent from "../../components/loader";

const AdminChat = () => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [history, setHistory] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const idUser = getSession();

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

  const getHistory = async () => {
    const res: any = await chatAdmin({
      id: idUser ? idUser : "",
      star: "pdteras",
    });
    if (res?.data?.data) {
      setHistory(res?.data?.data?.history[1]?.content);
      setContent(res?.data?.data?.history[2]?.content);
    }
  };
  const fetchData = async () => {
    await getHistory();
    scrollToBottom();
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-[dvh] lg:h-screen md:h-screen flex-col bg-white">
      <div className="container mx-auto p-4">
        <h3 className="font-semibold">History Admin</h3>
      </div>
      <div className="hide-scrollbar container mx-auto flex-1 space-y-2 overflow-y-auto p-4">
        {history && content ? (
          <>
            <AdminHIstoryChat message={`${content}${history}`} />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <>
            <LoadingComponent />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
