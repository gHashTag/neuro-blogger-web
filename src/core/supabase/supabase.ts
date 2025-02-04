'use client'
import { SupabaseUser, Task } from '@/interfaces'

import { captureExceptionSentry } from '../../utils/sentry'
import { SupabaseResponse } from '../../utils/types'
import { supabase } from '.'

interface QuestionContext {
  lesson_number?: number
  subtopic?: number
}

interface updateProgressContext {
  telegram_id: string
  isTrue: boolean
  path: string
}

interface UpdateResultParams {
  telegram_id: string
  language: string
  value: boolean
}

export async function getWorkspaceById(workspace_id: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('workspace_id', workspace_id)
  console.log(error, 'error')
  return data
}

export async function getWorkspaceByName(name: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('name', name)
  console.log(error, 'error')
  return data
}

export async function setMyWorkspace(telegram_id: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .insert([
      {
        title: 'Fire',
        telegram_id,
      },
    ])
    .select('*')

  if (error) console.log(error, 'setMyWorkspace error:::')
  const workspace_id = data && data[0].workspace_id
  return workspace_id
}

export async function setRoom(telegram_id: string) {
  const { data: dataRooms, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('telegram_id', telegram_id)
    .order('id', { ascending: false })

  const lastElement = dataRooms && dataRooms[0]
  if (error) {
    console.error(error, 'setRoom error:::')
  }
  return lastElement
}

export async function setPassport(passport: any) {
  const { data, error } = await supabase
    .from('user_passport')
    .insert(passport)
    .select('*')

  if (error) console.log('setPassport error:::', error)
  const passport_id = data && data[0].passport_id
  return passport_id
}

type CreateUserReturn = {
  userData: SupabaseUser[]
  telegram_id: string
  isUserExist: boolean
  error: any
}

type InviteT = {
  username: string
  first_name: string
  last_name: string
  is_bot: boolean
  language_code: string
  inviter: string
  invitation_codes: string
  telegram_id: number
  email?: string
  photo_url?: string
}

export async function createUser(
  usersData: InviteT
): Promise<CreateUserReturn> {
  const { telegram_id } = usersData
  console.log(telegram_id, 'telegram_id')

  // We check whether a user with the same telegram_id already exists
  const { data: existingUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegram_id)
    .maybeSingle()
  console.log(existingUser, 'existingUser')

  if (error) {
    console.error('Error checking user existence:', error)
    return {
      userData: [],
      telegram_id: '',
      isUserExist: false,
      error: error,
    }
  }

  if (existingUser) {
    console.log('User already exists', existingUser)
    return {
      userData: [existingUser],
      telegram_id: existingUser.telegram_id,
      isUserExist: true,
      error: null,
    }
  }

  const { data, error: insertError } = await supabase
    .from('users')
    .insert([usersData])
    .select()

  console.log(data, 'data create')

  if (insertError) {
    console.error('Error creating user:', insertError)
    return {
      userData: [],
      telegram_id: '',
      isUserExist: false,
      error: insertError,
    }
  }

  if (!data || data.length === 0) {
    console.error('User data was not returned after insertion')
    return {
      userData: [],
      telegram_id: '',
      isUserExist: false,
      error: 'User data was not returned after insertion',
    }
  }

  return {
    userData: data,
    telegram_id: data[0].telegram_id,
    isUserExist: false,
    error: insertError,
  }
}

export async function createRoom(username: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('username', username)

  return data
}

export const getSelectIzbushkaId = async (selectIzbushka: string) => {
  const { data: dataIzbushka, error: selectIzbushkaError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', selectIzbushka)

  const izbushka = dataIzbushka && dataIzbushka[0]

  if (izbushka) {
    return { dataIzbushka, izbushka, selectIzbushkaError: null }
  } else {
    return { dataIzbushka: [], izbushka: null, selectIzbushkaError }
  }
}

export async function getBiggest(
  lesson_number: number
): Promise<number | null> {
  const { data, error } = await supabase
    .from('javascript')
    .select('subtopic')
    .eq('lesson_number', lesson_number)
    .order('subtopic', { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  const result = data.length > 0 ? data[0].subtopic : null
  return result
}

export async function getQuestion(ctx: QuestionContext) {
  console.log(ctx)
  // Проверяем, предоставлены ли lesson_number и subtopic
  if (ctx.lesson_number == null || ctx.subtopic == null) {
    console.error('getQuestion lesson_number and subtopic')
    return [] // Возвращаем пустой массив или выбрасываем ошибку
  }

  const { lesson_number, subtopic } = ctx

  const { data, error } = await supabase
    .from('javascript')
    .select('*')
    .eq('lesson_number', lesson_number)
    .eq('subtopic', subtopic)

  if (error) {
    console.log(error, 'error supabase getQuestion')
    throw new Error(error.message)
  }

  return data
}

export async function resetProgress(username: string): Promise<void> {
  // Получаем telegram_id по username из таблицы users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('telegram_id')
    .eq('username', username)
    .single()

  if (userError || !userData) {
    throw new Error(userError?.message || 'User not found')
  }

  const userId = userData.telegram_id

  // Проверяем, существует ли запись в таблице javascript_progress для данного telegram_id
  const { data: progressData, error: progressError } = await supabase
    .from('progress')
    .select('telegram_id')
    .eq('telegram_id', userId)

  if (progressError) throw new Error(progressError.message)

  if (progressData && progressData.length === 0) {
    // Если записи нет, создаем новую
    const { error: insertError } = await supabase
      .from('progress')
      .insert([{ telegram_id: userId }])

    if (insertError) throw new Error(insertError.message)
  } else {
    // Если запись существует, очищаем все поля, кроме telegram_id и created_at
    const { error: updateError } = await supabase
      .from('progress')
      .update({
        javascript: 0,
      })
      .eq('telegram_id', userId)

    if (updateError) throw new Error(updateError.message)
  }
}

export async function getCorrects(telegram_id: string): Promise<number> {
  // Запрос к базе данных для получения данных пользователя
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('telegram_id', telegram_id)
    .single()

  if (error) {
    console.error('Error fetching data:', error)
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('User not found')
  }
  // Подсчет количества true значений
  const correctAnswers = data.javascript

  return correctAnswers
}

export async function updateProgress({
  telegram_id,
  isTrue,
}: updateProgressContext): Promise<void> {
  const { data: progressData, error: progressError } = await supabase
    .from('progress')
    .select('*')
    .eq('telegram_id', telegram_id)

  if (progressError) throw new Error(progressError.message)

  if (progressData && progressData.length === 0) {
    const { error: insertError } = await supabase
      .from('progress')
      .insert([{ telegram_id: telegram_id }])

    if (insertError) throw new Error(insertError.message)
  } else {
    const { error: updateError } = await supabase
      .from('progress')
      .update({
        javascript: isTrue
          ? progressData[0].javascript + 1
          : progressData[0].javascript,
      })
      .eq('telegram_id', telegram_id)

    if (updateError) throw new Error(updateError.message)
  }
}

export async function updateResult({
  telegram_id,
  language,
  value,
}: UpdateResultParams): Promise<void> {
  const { data, error } = await supabase
    .from('result')
    .upsert({ telegram_id, [language]: value }, { onConflict: 'telegram_id' })

  if (error) {
    console.error('Error updateResult:', error)
    throw error
  }

  console.log('Result successfully updated or inserted:', data)
}

export async function getUid(username: string) {
  // Запрос к таблице users для получения telegram_id по username
  const { data, error } = await supabase
    .from('users')
    .select('telegram_id')
    .eq('username', username)
    .single()

  if (error) {
    console.error('Error getting telegram_id:', error.message)
    throw new Error(error.message)
  }

  if (!data) {
    console.error('User not found')
    return null // or throw an error if the user must exist
  }

  // Возвращаем telegram_id
  return data.telegram_id
}

export async function getAssignedTasks(telegram_id: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .neq('telegram_id', telegram_id)
  // .neq("assigned_to", null)
  // .contains(
  //   "assigned_to",
  //   JSON.stringify([{ telegram_id }]),
  // );

  if (error) {
    console.error('Error getAssignedTasks:', error.message)
    throw new Error(error.message)
  }

  const nodeArray = data.map(value => {
    return {
      __typename: 'tasks',
      node: {
        ...value,
        // assigned_to: JSON.stringify(value.assigned_to),
      },
    }
  })

  return nodeArray
}

export const checkUsernameCodesByUserId = async (
  telegram_id: string
): Promise<{
  isInviterExist: boolean
  invitation_codes: string
  inviter_telegram_id: string
  error?: boolean
}> => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id)

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('telegram_id', telegram_id)

    if (roomsError) {
      console.error(roomsError, 'roomsError')
    }
    const invitation_codes = rooms && rooms[0]?.codes

    if (userError) {
      return {
        isInviterExist: false,
        invitation_codes: '',
        error: true,
        inviter_telegram_id: '',
      }
    }

    return {
      isInviterExist: userData.length > 0 ? true : false,
      invitation_codes,
      inviter_telegram_id: userData[0].telegram_id,
    }
  } catch (error) {
    console.error(error, 'error checkUsernameCodes')
    return {
      isInviterExist: false,
      invitation_codes: '',
      error: true,
      inviter_telegram_id: '',
    }
  }
}

export const checkUsernameCodesByUserName = async (
  username: string
): Promise<{
  isInviterExist: boolean
  invitation_codes: string
  inviter_telegram_id: string
  error?: boolean
}> => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('username', username)

    if (roomsError) {
      console.error(roomsError, 'roomsError')
    }
    const invitation_codes = rooms && rooms[0]?.codes

    if (userError) {
      return {
        isInviterExist: false,
        invitation_codes: '',
        error: true,
        inviter_telegram_id: '',
      }
    }

    return {
      isInviterExist: userData.length > 0 ? true : false,
      invitation_codes,
      inviter_telegram_id: userData[0].telegram_id,
    }
  } catch (error) {
    console.error(error, 'error checkUsernameCodes')
    return {
      isInviterExist: false,
      invitation_codes: '',
      error: true,
      inviter_telegram_id: '',
    }
  }
}

export const getRooms = async (username: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('username', username)

  return data
}

export const getUser = async (username: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)

  return data
}

export const checkUsername = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
  if (error) {
    console.log(error, 'error checkUsername')
    return false
  }
  return data ? data.length > 0 : false
}

export const checkUsernameAndReturnUser = async (
  username: string
): Promise<{
  isUserExist: boolean
  user: SupabaseUser
}> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)

  if (error) {
    console.log(error, 'error checkUsername')
    return {
      isUserExist: false,
      user: {} as SupabaseUser,
    }
  }
  return {
    isUserExist: data ? data.length > 0 : false,
    user: data[0],
  }
}

export const checkAndReturnUser = async (
  username: string
): Promise<{
  isUserExist: boolean
  user: SupabaseUser
}> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)

  if (error) {
    console.log(error, 'error checkUsername')
    return {
      isUserExist: false,
      user: {} as SupabaseUser,
    }
  }
  return {
    isUserExist: data ? data.length > 0 : false,
    user: data[0],
  }
}

export const getSupabaseUserByUsername = async (username: string) => {
  try {
    const response = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (response.error && response.error.code === 'PGRST116') {
      console.error('getSupabaseUser: Пользователь не найден')
      return null
    }

    if (response.error) {
      console.error('Error getting user info:', response.error)
      return null
    }

    return response.data
  } catch (error) {
    captureExceptionSentry('Error getting user info', 'useSupabase')
    return null
  }
}

const createUserInDatabase = async (
  newUser: SupabaseUser
): Promise<{ telegram_id: string }> => {
  await supabase.from('users').insert([newUser])
  const user = await getSupabaseUserByUsername(newUser.username || '')

  return user
}

export const updateUserInfoByUsername = async (user: {
  username: string
  email?: string
  photo_url?: string
}) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('username', user.username)
      .select()

    return data && data[0]
  } catch (error) {
    captureExceptionSentry(
      'Error getting updateUserInfoByUsername',
      'useSupabase'
    )
    return null
  }
}

export const setUserPhotoUrl = async ({
  username,
  photo_url,
}: {
  username: string
  photo_url: string
}): Promise<SupabaseUser[][] | Response> => {
  try {
    const { data, error }: SupabaseResponse<SupabaseUser[]> = await supabase
      .from('users')
      .update({ photo_url })
      .eq('username', username)
      .select('*')

    if (error) {
      throw new Error('Error setUserPhotoUrl: ' + error)
    }

    return data || []
  } catch (error) {
    throw new Error('Error setUserPhotoUrl: ' + error)
  }
}

export { supabase }
