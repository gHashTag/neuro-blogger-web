import { SupabaseUser } from '@/interfaces'
import { supabase } from '@/core/supabase/supabase'
import { SupabaseResponse } from '@/interfaces/types'

export const setVideoId = async (
  telegram_id: string,
  video_id: string
): Promise<SupabaseUser[][] | Response> => {
  try {
    const { data, error }: SupabaseResponse<SupabaseUser[]> = await supabase
      .from('videos')
      .insert([{ video_id, telegram_id }])
      .select('*')

    console.log(data, 'data')
    if (error) {
      throw new Error('Error setVideoId: ' + JSON.stringify(error))
    }

    return data || []
  } catch (error) {
    throw new Error('Error setVideoId: ' + error)
  }
}

export const setVideoUrl = async (
  video_id: string,
  url: string
): Promise<SupabaseUser[][] | Response> => {
  try {
    const { data, error }: SupabaseResponse<SupabaseUser[]> = await supabase
      .from('videos')
      .update({ url })
      .eq('video_id', video_id)
      .select('*')

    console.log(data, 'data')
    if (error) {
      throw new Error('Error setVideoUrl: ' + JSON.stringify(error))
    }

    return data || []
  } catch (error) {
    throw new Error('Error setVideoUrl: ' + error)
  }
}

interface Video {
  id: number
  created_at: string
  video_id: string
  url: string | null
  telegram_id: string
}

export const getVideoWithChatId = async (
  video_id: string
): Promise<{ video: Video; chat_id: number } | null> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(
        `
        *,
        users ( telegram_id )
      `
      )
      .eq('video_id', video_id)
      .single()

    if (error) {
      throw new Error('Error getVideoWithChatId: ' + error.message)
    }

    if (!data || !data.users) {
      return null
    }

    const video: Video = {
      id: data.id,
      created_at: data.created_at,
      video_id: data.video_id,
      url: data.url,
      telegram_id: data.telegram_id,
    }

    const chat_id = data.users.telegram_id

    return { video, chat_id }
  } catch (error) {
    console.error('Error getVideoWithChatId:', error)
    return null
  }
}
