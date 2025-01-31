import { gql } from '@apollo/client'

export const GET_ALL_TASKS = gql`
  query GetRoomTasks {
    tasksCollection(orderBy: { created_at: DescNullsFirst }) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          recording_id
          created_at
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const TASKS_COLLECTION_QUERY = gql`
  query GetTasks(
    $telegram_id: UUID!
    $room_id: String!
    $recording_id: String
    $workspace_id: UUID!
  ) {
    tasksCollection(
      filter: {
        and: [
          {
            workspace_id: { eq: $workspace_id }
            telegram_id: { eq: $telegram_id }
            room_id: { eq: $room_id }
            recording_id: { eq: $recording_id }
          }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          recording_id
          title
          description
          is_public
          cost
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTasks($objects: [tasksInsertInput!]!) {
    insertIntotasksCollection(objects: $objects) {
      records {
        id
        telegram_id
        created_at
        title
        description
        updated_at
        due_date
        priority
        workspace_id
        room_id
        recording_id
        cost
        is_public
        completed_at
        is_archived
        status
        label
        user_passport {
          telegram_id
          first_name
          last_name
          photo_url
          passport_id
        }
      }
    }
  }
`

export const MUTATION_TASK_STATUS_UPDATE = gql`
  mutation updatetasksCollection(
    $id: BigInt!
    $status: BigInt!
    $title: String!
    $description: String!
    $is_public: Boolean!
    $cost: BigInt!
    $updated_at: Datetime!
    $order: BigInt!
  ) {
    updatetasksCollection(
      filter: { id: { eq: $id } }
      set: {
        status: $status
        updated_at: $updated_at
        title: $title
        description: $description
        is_public: $is_public
        cost: $cost
        order: $order
      }
    ) {
      records {
        id
        workspace_id
        room_id
        recording_id
        telegram_id
        title
        description
        status
        is_public
        cost
        due_date
        completed_at
        is_archived
        updated_at
        created_at
        label
        priority
        order
        user_passport {
          telegram_id
          first_name
          last_name
          photo_url
          passport_id
        }
      }
    }
  }
`

export const MUTATION_TASK_UPDATE = gql`
  mutation updatetasksCollection(
    $id: BigInt!
    $status: String!
    $priority: String!
    $label: String!
    $title: String!
    $description: String!
    $is_public: Boolean!
    $cost: BigInt!
    $updated_at: Datetime!
  ) {
    updatetasksCollection(
      filter: { id: { eq: $id } }
      set: {
        title: $title
        description: $description
        label: $label
        status: $status
        priority: $priority
        is_public: $is_public
        cost: $cost
        updated_at: $updated_at
      }
    ) {
      records {
        id
        telegram_id
        title
        description
        status
        due_date
        is_public
        cost
        completed_at
        is_archived
        updated_at
        created_at
        label
        priority
        user_passport {
          telegram_id
          first_name
          last_name
          photo_url
          passport_id
        }
      }
    }
  }
`

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($filter: tasksFilter!, $atMost: Int!) {
    deleteFromtasksCollection(filter: $filter, atMost: $atMost) {
      records {
        id
        title
      }
    }
  }
`

export const GET_TASKS_BY_RECORDING_ID = gql`
  query GetUserTasks($recording_id: String!) {
    tasksCollection(
      filter: {
        and: [
          {
            id: { eq: $id }
            telegram_id: { eq: $telegram_id }
            workspace_id: { eq: $workspace_id }
            room_id: { eq: $room_id }
            recording_id: { eq: $recording_id }
          }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const GET_TASK_BY_ID = gql`
  query GetUserTasks(
    $id: UUID!
    $telegram_id: UUID!
    $workspace_id: UUID!
    $room_id: String!
    $recording_id: String!
  ) {
    tasksCollection(
      filter: {
        and: [
          {
            id: { eq: $id }
            telegram_id: { eq: $telegram_id }
            workspace_id: { eq: $workspace_id }
            room_id: { eq: $room_id }
            recording_id: { eq: $recording_id }
          }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          is_public
          cost
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

// export const GET_TASKS_FOR_WORKSPACE = gql`
//   query GetRoomTasks($telegram_id: UUID!, $workspace_id: UUID!) {
//     tasksCollection(
//       filter: {
//         and: [
//           { workspace_id: { eq: $workspace_id }, telegram_id: { eq: $telegram_id } }
//         ]
//       }
//       orderBy: { created_at: DescNullsFirst }
//     ) {
//       edges {
//         node {
//           id
//           telegram_id
//           workspace_id
//           room_id
//           created_at
//           recording_id
//           title
//           description
//           is_public
//           cost
//           updated_at
//           due_date
//           priority
//           completed_at
//           is_archived
//           status
//           label
//           assigned_to
//         }
//       }
//     }
//   }
// `;

export const GET_TASKS_FOR_ROOM = gql`
  query GetRoomTasks(
    $telegram_id: UUID!
    $room_id: String!
    $workspace_id: UUID!
  ) {
    tasksCollection(
      filter: {
        and: [
          {
            workspace_id: { eq: $workspace_id }
            telegram_id: { eq: $telegram_id }
            room_id: { eq: $room_id }
          }
        ]
      }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          title
          description
          recording_id
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const GET_ROOM_TASKS_WORKSPACE_ID_QUERY = gql`
  query GetPublicRoomTasks($workspace_id: UUID!) {
    tasksCollection(
      filter: { and: [{ workspace_id: { eq: $workspace_id } }] }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          is_public
          cost
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const GET_PUBLIC_ROOM_TASKS_QUERY = gql`
  query GetPublicRoomTasks {
    tasksCollection(
      filter: { and: [{ is_public: { eq: true } }] }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          is_public
          cost
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const GET_TASKS_BY_telegram_id = gql`
  query GetUserTasks($telegram_id: UUID!) {
    tasksCollection(
      filter: { and: [{ telegram_id: { eq: $telegram_id } }] }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`

export const GET_TASKS_BY_NOT_EQ_telegram_id = gql`
  query GetUserTasks($telegram_id: UUID!) {
    tasksCollection(
      filter: { and: [{ telegram_id: { neq: $telegram_id } }] }
      orderBy: { created_at: DescNullsFirst }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          room_id
          created_at
          recording_id
          title
          description
          updated_at
          due_date
          priority
          completed_at
          is_archived
          status
          label
          user_passport {
            telegram_id
            first_name
            last_name
            photo_url
            passport_id
          }
        }
      }
    }
  }
`
