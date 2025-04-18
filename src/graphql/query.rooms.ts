import { gql } from '@apollo/client'

export const ROOM_INFO = gql`
  query RoomInfo {
    room_id @client
    room_name @client
    room_type @client
  }
`

export const GET_ROOMS_COLLECTIONS_BY_ROOM_ID_QUERY = gql`
  query RoomsCollection($room_id: String!) {
    roomsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          name
          username
          description
          updated_at
          created_at
          type
          enabled
          description
          room_code
          token
          room_id
          chat_id
        }
      }
    }
  }
`

export const GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_QUERY = gql`
  query RoomsCollection($workspace_id: Int!, $telegram_id: BigInt!) {
    roomsCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id } }
          { telegram_id: { eq: $telegram_id } }
        ]
      }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          name
          username
          description
          updated_at
          created_at
          type
          enabled
          description
          room_code
          token
          room_id
          chat_id
        }
      }
    }
  }
`

export const GET_ROOMS_COLLECTIONS_BY_telegram_id_QUERY = gql`
  query RoomsCollection($telegram_id: BigInt!) {
    roomsCollection(filter: { telegram_id: { eq: $telegram_id } }) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          name
          username
          description
          updated_at
          created_at
          type
          enabled
          description
          token
          room_code
          room_id
          chat_id
        }
      }
    }
  }
`

export const ROOMS_BY_ID_COLLECTION_QUERY = gql`
  query RoomsCollection($room_id: String!) {
    roomsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          name
          description
          updated_at
          created_at
          token
          type
          enabled
          description
          room_code
          room_id
        }
      }
    }
  }
`

export const GET_ROOMS_COLLECTIONS_BY_WORKSPACE_ID_ROOM_ID_QUERY = gql`
  query RoomsCollection(
    $workspace_id: Int!
    $room_id: String!
    $telegram_id: BigInt!
  ) {
    roomsCollection(
      filter: {
        and: [
          { workspace_id: { eq: $workspace_id } }
          { room_id: { eq: $room_id } }
          { telegram_id: { eq: $telegram_id } }
        ]
      }
    ) {
      edges {
        node {
          id
          telegram_id
          workspace_id
          name
          username
          description
          updated_at
          created_at
          type
          enabled
          token
          description
          room_code
          room_id
          chat_id
        }
      }
    }
  }
`

export const DELETE_ROOM_MUTATION = gql`
  mutation DeleteFromroomsCollection($room_id: String!) {
    deleteFromroomsCollection(filter: { room_id: { eq: $room_id } }) {
      records {
        id
      }
    }
  }
`

export const GET_ROOM_ASSET = gql`
  query RoomAssetsCollection($recording_id: String!) {
    room_assetsCollection(filter: { recording_id: { eq: $recording_id } }) {
      edges {
        node {
          id
          title
          summary_short
          transcription
          recording_id
        }
      }
    }
  }
`

export const GET_ROOMS_ASSETS_COLLECTION = gql`
  query RoomAssetsCollection($room_id: String!) {
    room_assetsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          title
          summary_short
          recording_id
          transcription
          room_id
        }
      }
    }
  }
`

export const ROOM_NAME_COLLECTION_QUERY = gql`
  query RoomsCollectionByName($room_id: String!) {
    roomsCollection(filter: { room_id: { eq: $room_id } }) {
      edges {
        node {
          id
          telegram_id
          name
          description
          updated_at
          created_at
          type
          enabled
          description
          room_code
          room_id
        }
      }
    }
  }
`

export const UPDATE_ROOM_MUTATION = gql`
  mutation UpdateRoomsCollection(
    $id: Int!
    $name: String!
    $chat_id: String!
    $token: String!
  ) {
    updateroomsCollection(
      filter: { id: { eq: $id } }
      set: { name: $name, chat_id: $chat_id, token: $token }
    ) {
      records {
        id
        name
        chat_id
        token
      }
    }
  }
`
