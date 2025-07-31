import { DEV_AUTH_BYPASS, DEV_MOCK_USER } from "@/utils/constants";

const useUser = () => {
  // 🕉️ Dev Authentication Bypass: Use mock data if enabled
  if (DEV_AUTH_BYPASS) {
    console.log('🕉️ DEV_AUTH_BYPASS is active - using mock user data');
    const language_code = typeof navigator !== "undefined" 
      ? navigator.language.substring(0, 2) 
      : "en";
      
    return {
      username: DEV_MOCK_USER.username,
      user_id: DEV_MOCK_USER.user_id,
      workspace_id: DEV_MOCK_USER.workspace_id,
      workspace_name: DEV_MOCK_USER.workspace_name,
      header_name: DEV_MOCK_USER.header_name,
      room_id: DEV_MOCK_USER.room_id,
      room_name: DEV_MOCK_USER.room_name,
      recording_id: DEV_MOCK_USER.recording_id,
      recording_name: DEV_MOCK_USER.recording_name,
      photo_url: DEV_MOCK_USER.photo_url,
      firstName: DEV_MOCK_USER.first_name,
      lastName: DEV_MOCK_USER.last_name,
      language_code,
      is_owner: DEV_MOCK_USER.is_owner,
      workspace_type: DEV_MOCK_USER.workspace_type,
    };
  }

  // Original localStorage-based logic
  const username = localStorage.getItem("username") || "";
  const user_id = localStorage.getItem("user_id") || "";
  const workspace_id = localStorage.getItem("workspace_id") || "";
  const workspace_name = localStorage.getItem("workspace_name") || "";
  const workspace_type = localStorage.getItem("workspace_type");

  const header_name = localStorage.getItem("header_name") || "";
  const room_id = localStorage.getItem("room_id") || "";
  const room_name = localStorage.getItem("room_name") || "";
  const recording_id = localStorage.getItem("recording_id") || "";
  const recording_name = localStorage.getItem("recording_name") || "";
  const photo_url = localStorage.getItem("photo_url") || "";
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const language_code = navigator.language.substring(0, 2);
  const owner = localStorage.getItem("is_owner");

  const is_owner = owner === "false" ? false : true;

  return {
    username,
    user_id,
    workspace_id,
    workspace_name,
    header_name,
    room_id,
    room_name,
    recording_id,
    recording_name,
    photo_url,
    firstName,
    lastName,
    language_code,
    is_owner,
    workspace_type,
  };
};

export { useUser };
