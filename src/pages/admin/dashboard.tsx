import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase/connection";
import { generateRandomString } from "../../services/api/chat.services";
import { getSession } from "../../shared/Session";
import useNotification from "antd/es/notification/useNotification";
import { changelocalid } from "../../services/supabase/session.service";

const DashboardAdmin = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingid, setLoadingid] = useState(false);

  const [id, setId] = useState("");
  const [api, ref] = useNotification();
  useEffect(() => {
    fetchSwitchValue();
    getSes();
  }, [id]);

  const getSes = async () => {
    const res = getSession();
    if (res) {
      setId(res);
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

  const toggleSwitch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("adminsettings")
        .update({ switch: !switchValue })
        .eq("id", 1);

      if (error) {
        setLoading(false);
        throw error;
      }
      console.log(data);
      if (data === null) {
        setLoading(false);
        setSwitchValue(!switchValue);
        location.reload();
      }
    } catch (error: any) {
      console.error("Error toggling switch:", error.message);
    }
  };

  const switchID = async () => {
    const res = await generateRandomString();
    setLoadingid(true);
    if (res) {
      const respons = await changelocalid({ newUserId: res });
      if (respons?.status === 204) {
        setTimeout(() => {
          location.reload();
        }, 600);
        setLoadingid(false);

        return api.success({ message: "Success Change ID" });
      }
    }
  };

  return (
    <div className="container mx-auto">
      {ref}
      <div className="grid grid-cols-12 space-y-2 py-10">
        <div className="col-span-3"></div>
        <div className="col-span-8 border-2 rounded-md p-4">
          <h1 className="font-semibold">Audio Setting</h1>
          <div className="text-sm py-2 flex items-center justify-between">
            <h1>{switchValue ? "Audio On" : "Audio Off"}</h1>
            <button
              className={`px-4 py-2 font-semibold text-white rounded-md ${
                switchValue
                  ? "bg-green-500 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-700"
              } transition duration-300`}
              onClick={toggleSwitch}
            >
              {loading ? "Loading..." : switchValue ? "On" : "Off"}
            </button>
          </div>
        </div>
        <div className="col-span-3"></div>
        <div className="col-span-8 border-2 rounded-md p-4">
          <h1 className="font-semibold">Change ID</h1>
          <div className="text-sm py-2 flex items-center justify-between">
            <h1>{id ? id : "loading"}</h1>
            <button
              disabled={loadingid}
              className={`px-4 py-2 font-semibold text-white rounded-md bg-[#5751c8] transition duration-300`}
              onClick={switchID}
            >
              {loadingid ? "Loading ..." : "Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
