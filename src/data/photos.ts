const generateImageUrls = (
  basePath: string,
  count: number,
  type: string
): string[] => {
  return Array.from({ length: count }, (_, i) => `${basePath}/${i + 1}.${type}`)
}

const generateImageUrlsWithName = (
  basePath: string,
  count: number,
  name: string,
  type: string
): string[] => {
  return Array.from(
    { length: count },
    (_, i) => `${basePath}/${name}_${i + 1}.${type}`
  )
}

const baseUrl =
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars'

const neuroPhotoNeuroCoder = generateImageUrls(
  `${baseUrl}/neuro_blogger_bot/neurophoto`,
  30,
  'jpg'
)
const neuroPhotoPlayom = generateImageUrls(
  `${baseUrl}/playom/neurophoto`,
  30,
  'jpg'
)

const metaMuseAutor = generateImageUrls(
  `${baseUrl}/MetaMuse_Manifest_bot/neurophoto`,
  30,
  'jpg'
)

const neuroPhotoRyabinikaPerm = generateImageUrlsWithName(
  `${baseUrl}/NeuroLenaAssistant_bot/neurophoto`,
  34,
  'neurophoto',
  'jpeg'
)

export {
  neuroPhotoNeuroCoder,
  neuroPhotoPlayom,
  metaMuseAutor,
  neuroPhotoRyabinikaPerm,
}
