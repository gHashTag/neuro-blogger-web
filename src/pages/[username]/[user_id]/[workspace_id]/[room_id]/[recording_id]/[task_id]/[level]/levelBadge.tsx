interface LevelBadgeProps {
  level: number
  is_ru: boolean
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, is_ru }) => {
  return (
    <div className='absolute left-0 top-0 rounded-br-lg bg-white bg-opacity-30 p-4 shadow-md'>
      <h2 className='text-sm font-bold tracking-wide text-black'>
        {is_ru ? 'УРОВЕНЬ АВАТАРА' : 'AVATAR LEVEL'} {level}
      </h2>
    </div>
  )
}

export default LevelBadge
