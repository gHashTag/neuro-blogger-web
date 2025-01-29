import { supabase } from '.'

export async function getTranslation(
  languageCode: string,
  key: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('translation')
      .eq('language_code', languageCode)
      .eq('key', key)
      .single()

    console.log('data', data)
    if (error) {
      console.error('Error fetching translation:', error)
      return null
    }

    return data?.translation || null
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
}
