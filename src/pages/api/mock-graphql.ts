import type { NextApiRequest, NextApiResponse } from "next";
import { DEV_AUTH_BYPASS } from "@/utils/constants";

// 🕉️ Mock GraphQL API for development bypass
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow in dev bypass mode
  if (!DEV_AUTH_BYPASS) {
    return res.status(404).json({ message: "Not found" });
  }

  console.log('🕉️ Mock GraphQL API called:', req.body?.query);

  // Mock responses for common GraphQL queries with playra data
  const mockResponse = {
    data: {
      user_passportCollection: {
        edges: [
          {
            node: {
              id: "1",
              user_id: "neuro_sage-user-id-999",
              username: "neuro_sage",
              passport_id: 1,
              type: "workspace",
              created_at: "2024-01-01T00:00:00.000Z",
              __typename: "user_passport"
            }
          }
        ]
      },
      tasksCollection: {
        edges: [
          {
            node: {
              id: "task-1",
              name: "Dev Task Example",
              description: "Sample task for development",
              status: "active",
              user_id: "neuro_sage-user-id-999",
              workspace_id: "neuro_sage-workspace-main",
              created_at: "2024-01-01T00:00:00.000Z",
              __typename: "tasks"
            }
          }
        ]
      },
      workspacesCollection: {
        edges: [
          {
            node: {
              id: "neuro_sage-workspace-main",
              name: "Neuro Sage Main Workspace",
              description: "Main workspace for development",
              user_id: "neuro_sage-user-id-999",
              type: "personal",
              created_at: "2024-01-01T00:00:00.000Z",
              __typename: "workspaces"
            }
          }
        ]
      },
      roomsCollection: {
        edges: [
          {
            node: {
              id: "neuro_sage-room-dev",
              name: "Neuro Sage Dev Room",
              description: "Development room for testing",
              workspace_id: "neuro_sage-workspace-main",
              user_id: "neuro_sage-user-id-999",
              token: "dev-room-token",
              chat_id: "dev-chat-id",
              created_at: "2024-01-01T00:00:00.000Z",
              __typename: "rooms"
            }
          }
        ]
      }
    }
  };

  return res.status(200).json(mockResponse);
}