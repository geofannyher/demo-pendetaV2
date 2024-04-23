import { TChatProps } from "../utils/types/chat.type";
import ai from "../assets/ai.jpg";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { textToSpeech } from "../services/api/elevenlabs.service";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/connection";
export const AiChat = ({ message, isLastAIChat, audioUrl }: TChatProps) => {
  const [audioSrc, setAudioSrc] = useState("");
  const [switchValue, setSwitchValue] = useState();
  const [status, setStatus] = useState(false);

  // console.log(audioUrl);
  useEffect(() => {
    fetchSwitchValue();
    // Panggil fetchTextToSpeech hanya saat pesan terakhir dari AIChat pertama kali ditampilkan
    if (isLastAIChat && !audioSrc && switchValue && audioUrl) {
      fetchTextToSpeech();
    }
  }, [isLastAIChat, audioSrc, switchValue, audioUrl]);

  const fetchTextToSpeech = async () => {
    if (audioUrl !== undefined) {
      try {
        setStatus(true);
        const result: any = await textToSpeech(audioUrl);
        const audioBlob = new Blob([result.data], { type: "audio/mpeg" });
        const audioSrc = URL.createObjectURL(audioBlob);
        setAudioSrc(audioSrc);
        setStatus(false);
      } catch (error) {
        console.error("Failed to convert text to speech:");
      }
    } else {
      console.log("text undifined");
    }
  };

  const fetchSwitchValue = async () => {
    try {
      const { data, error } = await supabase
        .from("adminsettings")
        .select("switch")
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        setSwitchValue(data.switch);
      }
    } catch (error: any) {
      console.error("Error fetching switch value:", error?.message);
    }
  };
  return (
    <div className="flex justify-start py-2">
      <div className="flex items-start">
        <div className="flex gap-2 items-start">
          <img
            src={ai}
            className="h-10 w-10 items-center justify-center rounded-full object-cover"
          />
          <div
            style={{ whiteSpace: "pre-line" }}
            className="w-auto max-w-2xl rounded-br-xl rounded-tl-xl overflow-auto rounded-tr-xl bg-chatAi p-4 shadow-sm"
          >
            <Markdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} style={{ color: "blue" }} />
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {message}
            </Markdown>
            {status
              ? "Loading Audio..."
              : isLastAIChat &&
                switchValue && (
                  <audio controls>
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserChat = ({ message }: TChatProps) => {
  return (
    <div className="flex justify-end py-2">
      <div className="w-auto  max-w-xs rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-mainColor p-4 text-white shadow-sm">
        <p>{message}</p>
      </div>
    </div>
  );
};

export const AdminHIstoryChat = ({ message }: TChatProps) => {
  return (
    <div className="flex justify-start py-2">
      <div className="flex items-start">
        <div className="flex gap-2 items-start">
          <img
            src={ai}
            className="h-10 w-10 items-center justify-center rounded-full object-cover"
          />
          <div
            style={{ whiteSpace: "pre-line" }}
            className="w-auto max-w-2xl rounded-br-xl rounded-tl-xl text-sm overflow-auto rounded-tr-xl bg-chatAi p-4 shadow-sm"
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
