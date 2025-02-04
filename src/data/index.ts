import { Author } from '@/interfaces'

export * from './authors'
export * from './problemData'

export const initialAuthorState: Author = {
  name: '',
  telegram: '',
  role: '',
  experience: '',
  bonusDescription: '',
  imageUrl: '',
  description: '',
  achievements: [],
  achievementDescriptions: {},
  title: '',
  subtitle: '',
  bonusTitle: '',
  neurosmmDescription: '',
}
