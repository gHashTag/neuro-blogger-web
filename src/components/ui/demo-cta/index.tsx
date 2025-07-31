import { useEffect, useRef } from "react";
import useClickOutside from "@lib/hooks/use-click-outside";
import { useReactiveVar } from "@apollo/client";
import { visibleSignInVar, setInviterUserInfo } from "@/apollo/reactive-store";

import { TLoginButton, TLoginButtonSize, TUser } from "react-telegram-auth";
import { createUser } from "@/nextapi/index";
// import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/router";
import { botName, DEV_AUTH_BYPASS, DEV_MOCK_USER } from "@/utils/constants";

const DemoButton = () => {
  const visible = useReactiveVar(visibleSignInVar);
  const userInfo = useReactiveVar(setInviterUserInfo);

  const router = useRouter();
  // const { createSupabaseUser } = useSupabase();

  useEffect(() => {
    // 🕉️ Dev Authentication Bypass: Auto-login as playra
    if (DEV_AUTH_BYPASS && visible) {
      console.log("🎭 DEV_AUTH_BYPASS: Auto-logging in as playra...");

      // Simulate Telegram user response
      const mockTelegramUser: TUser = {
        id: DEV_MOCK_USER.telegram_id,
        first_name: DEV_MOCK_USER.first_name,
        last_name: DEV_MOCK_USER.last_name,
        username: DEV_MOCK_USER.username,
        photo_url: DEV_MOCK_USER.photo_url,
        auth_date: Math.floor(Date.now() / 1000),
        hash: "dev-bypass-hash",
      };

      // Auto-execute login after a short delay
      setTimeout(() => {
        handleTelegramResponse(mockTelegramUser);
      }, 500);

      return; // Skip the normal overlay logic in dev mode
    }

    // Normal behavior for production
    setTimeout(() => {
      const el = document.getElementById("cta-btn");
      el?.classList.add("show-overlay");
      const tooltip = document.getElementById("cta-tooltip");
      tooltip?.classList.add("fade-in");
    }, 3000);
  }, [visible]);
  const ctaRef = useRef(null);
  const clickedOutside = () => {
    const el = document.getElementById("cta-btn");
    const tooltip = document.getElementById("cta-tooltip");
    tooltip?.remove();
    el?.classList.remove("show-overlay");
  };
  useClickOutside(ctaRef, clickedOutside);

  const handleTelegramResponse = async (user: TUser) => {
    // 🕉️ Dev Authentication Bypass: Use mock data
    if (DEV_AUTH_BYPASS) {
      console.log("🎭 DEV_AUTH_BYPASS: Using mock login data for playra");

      // Set all localStorage data using DEV_MOCK_USER
      localStorage.setItem("username", DEV_MOCK_USER.username);
      localStorage.setItem("user_id", DEV_MOCK_USER.user_id);
      localStorage.setItem("workspace_id", DEV_MOCK_USER.workspace_id);
      localStorage.setItem("workspace_name", DEV_MOCK_USER.workspace_name);
      localStorage.setItem("workspace_type", DEV_MOCK_USER.workspace_type);
      localStorage.setItem("header_name", DEV_MOCK_USER.header_name);
      localStorage.setItem("room_id", DEV_MOCK_USER.room_id);
      localStorage.setItem("room_name", DEV_MOCK_USER.room_name);
      localStorage.setItem("recording_id", DEV_MOCK_USER.recording_id);
      localStorage.setItem("recording_name", DEV_MOCK_USER.recording_name);
      localStorage.setItem("first_name", DEV_MOCK_USER.first_name);
      localStorage.setItem("last_name", DEV_MOCK_USER.last_name);
      localStorage.setItem("photo_url", DEV_MOCK_USER.photo_url);

      // Navigate to playra's page
      router.push(`/${DEV_MOCK_USER.username}/${DEV_MOCK_USER.user_id}`);
      return;
    }

    // Normal production behavior
    const userDataForBaseRecord = {
      ...user,
      ...userInfo,
      telegram_id: user.id,
    };
    console.log(userDataForBaseRecord, "userDataForBaseRecord");
    const newUserDataFromBase = await createUser(userDataForBaseRecord);
    console.log(newUserDataFromBase, "newUserDataFromBase");
    //
    if (!userDataForBaseRecord.username)
      throw new Error("Username is required");
    localStorage.setItem("username", userDataForBaseRecord.username);

    if (!newUserDataFromBase.user_id) throw new Error("User ID is required");
    localStorage.setItem("user_id", newUserDataFromBase.user_id);

    localStorage.setItem("first_name", user.first_name);
    localStorage.setItem("last_name", user.last_name || "");
    localStorage.setItem("photo_url", user.photo_url || "");

    localStorage.setItem("recording_id", "");
    localStorage.setItem("room_id", "");
    localStorage.setItem("workspace_id", "");
    localStorage.setItem("photo_url", "");
    router.push(`/${user.username}/0`);
  };

  return (
    <>
      {visible && !DEV_AUTH_BYPASS && (
        <TLoginButton
          botName={botName}
          buttonSize={TLoginButtonSize.Large}
          lang="en"
          usePic={true}
          cornerRadius={20}
          onAuthCallback={handleTelegramResponse}
          requestAccess={"write"}
          // additionalClasses={"css-class-for-wrapper"}
        />
      )}
      {visible && DEV_AUTH_BYPASS && (
        <div className="text-center p-4 border border-yellow-500 border-dashed rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            🎭 <strong>Dev Mode:</strong> Auto-logging as{" "}
            <strong>neuro_sage</strong>...
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            Telegram Login Button hidden in development
          </p>
        </div>
      )}
    </>
  );
};

export default DemoButton;
