import { ChevronDown } from 'lucide-react'
import { courseModules } from './Modules'

export function CourseProgram() {
  return (
    <div className='rounded-2xl bg-white p-8'>
      <h2 className='mb-8 text-center text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl'>
        Программа курса
      </h2>
      <div className='space-y-4'>
        {courseModules.map((module, moduleIndex) => (
          <details key={moduleIndex} className='group'>
            <summary className='flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100'>
              <span className='font-medium text-gray-800'>{module.title}</span>
              <ChevronDown className='h-5 w-5 text-gray-500 transition-transform group-open:rotate-180' />
            </summary>
            <div className='p-4 text-gray-600'>
              <ul className='list-disc pl-5'>
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex} className='mb-2'>
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
