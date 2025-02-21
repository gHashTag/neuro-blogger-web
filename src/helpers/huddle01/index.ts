import { AccessToken } from '@huddle01/server-sdk/auth'

export const createToken = async (
  roomId: string,
  role: string,
  displayName: string,
  admin: boolean
) => {
  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE01_API_KEY as string,
    roomId: roomId as string,
    role: role,
    permissions: {
      admin,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        displayName,
      },
    },
  })

  const token = await accessToken.toJwt()
  console.log('token', token.slice(0, 10))

  return token
}
