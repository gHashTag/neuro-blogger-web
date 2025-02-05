const generateImageUrls = (basePath: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `${basePath}/${i + 1}.jpg`)
}

const baseUrl =
  'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/avatars'

const neuroPhotoNeuroCoder = generateImageUrls(
  `${baseUrl}/neuro_sage/neurophoto`,
  30
)
const neuroPhotoPlayom = generateImageUrls(`${baseUrl}/playom/neurophoto`, 30)
const metaMuseAutor = generateImageUrls(`${baseUrl}/muse_nataly/neurophoto`, 30)

export { neuroPhotoNeuroCoder, neuroPhotoPlayom, metaMuseAutor }
