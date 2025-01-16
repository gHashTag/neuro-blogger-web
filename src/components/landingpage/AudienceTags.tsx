import {
  Sparkles,
  Instagram,
  Briefcase,
  Palette,
  PenTool,
  GraduationCap,
  Lightbulb,
} from 'lucide-react'

type AudienceTag = {
  icon: React.ReactNode
  text: string
  bgColor: string
  textColor: string
}

const audienceTags: AudienceTag[] = [
  {
    icon: <Sparkles className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Для новичков',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
  },
  {
    icon: <GraduationCap className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Без опыта',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
  {
    icon: <Lightbulb className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Начинающим',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  {
    icon: <Instagram className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Для блогеров',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
  },
  {
    icon: <Briefcase className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Для бизнеса',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    icon: <Palette className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Дизайнерам',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  {
    icon: <PenTool className='h-3 w-3 sm:h-4 sm:w-4' />,
    text: 'Копирайтерам',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
]

export function AudienceTags() {
  return (
    <div className='flex flex-wrap justify-center gap-1 px-1 sm:gap-3 sm:px-4 md:gap-4'>
      {audienceTags.map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 sm:gap-2 ${tag.bgColor} ${tag.textColor} cursor-pointer select-none rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-all duration-300 hover:shadow-sm sm:px-4 sm:py-2 sm:text-sm`}
        >
          {tag.icon}
          <span className='max-w-[80px] truncate sm:max-w-none'>
            {tag.text}
          </span>
        </span>
      ))}
    </div>
  )
}
