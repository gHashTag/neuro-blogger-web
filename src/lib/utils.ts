import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFallbackAvatar = () => {
  return 'https://github.com/Huddle01/Audio-Spaces-Example-App-V2/blob/main/public/avatars/avatars/10.png?raw=true'
}
