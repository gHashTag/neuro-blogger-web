export const baseUrl =
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars'

// Функция для генерации URL изображений
function generateImageUrls(
  basePath: string,
  count: number,
  type: string = 'jpg'
): string[] {
  console.log('🚀 Генерация URL для пути:', basePath)
  const urls = Array.from(
    { length: count },
    (_, i) => `${basePath}/${i + 1}.${type}`
  )
  console.log('📸 Пример URL:', urls[0])
  return urls
}

// Функция для генерации URL изображений с префиксом
function generateImageUrlsWithPrefix(
  basePath: string,
  prefix: string,
  count: number,
  type: string = 'jpeg'
): string[] {
  console.log('🚀 Генерация URL для пути:', basePath)
  const urls = Array.from(
    { length: count },
    (_, i) => `${baseUrl}${basePath}/${prefix}_${i + 1}.${type}`
  )
  console.log('📸 Пример URL:', urls[0])
  return urls
}

// URL для фотографий разных пользователей
export const neuroPhotoNeuroCoder = generateImageUrls(
  `${baseUrl}/neuro_blogger_bot/neurophoto`,
  30,
  'jpg'
)
export const neuroPhotoPlayom = generateImageUrls(
  `${baseUrl}/playom/neurophoto`,
  30,
  'jpg'
)
export const metaMuseAutor = generateImageUrls(
  `${baseUrl}/MetaMuse_Manifest_bot/neurophoto`,
  30,
  'jpg'
)

// Для ryabinika_perm используем правильный путь и формат
export const neuroPhotoRyabinikaPerm = generateImageUrlsWithPrefix(
  '/NeuroLenaAssistant_bot/neurophoto',
  'neurophoto',
  34,
  'jpeg'
)
