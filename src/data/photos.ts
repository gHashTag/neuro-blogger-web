const generateImageUrls = (basePath: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `${basePath}/${i + 1}.jpg`)
}

const baseUrl =
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars'

const neuroPhotoNeuroCoder = generateImageUrls(
  `${baseUrl}/neuro_blogger_bot/neurophoto`,
  30
)
const neuroPhotoPlayom = generateImageUrls(`${baseUrl}/playom/neurophoto`, 30)
const metaMuseAutor = generateImageUrls(
  `${baseUrl}/MetaMuse_Manifest_bot/neurophoto`,
  30
)

export { neuroPhotoNeuroCoder, neuroPhotoPlayom, metaMuseAutor }
