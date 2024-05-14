import { supabase } from "./connection";

export const getIdSession = async () => {
  try {
    const data = await supabase.from("user").select("localidV2").single();

    if (data) {
      return data;
    } else {
      throw new Error("User not found");
    }
  } catch (error: any) {
    return error.message;
  }
};

export const changelocalid = async ({ newUserId }: any) => {
  try {
    const data = await supabase
      .from("user")
      .update({ localidV2: newUserId })
      .eq("id", 4);
    return data;
  } catch (error: any) {
    return error.message;
  }
};
