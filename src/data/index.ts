import { Author } from './authorsHomePage'

export * from './authors'

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
