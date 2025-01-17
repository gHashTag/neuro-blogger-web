import { ProblemSection } from '@/components/landingpage/ProblemSection'
import { SolutionSection } from '@/components/landingpage/SolutionSection'
import { LearningOutcomes } from '@/components/landingpage/LearningOutcomes'
import { FAQ } from '@/components/landingpage/FAQ'
import { Footer } from '@/components/landingpage/Footer'
import { CourseBlock } from '@/components/landingpage/CourseBlock'
import { CoursePricing } from '@/components/landingpage/CoursePricing'
import { AuthorSection } from '@/components/landingpage/AuthorSection'
import { HeroIntensive } from '@/components/landingpage/HeroIntensive'
import { AudienceTags } from '@/components/landingpage/AudienceTags'

import { MainMenu } from '@/components/landingpage/MainMenu'
import { CourseProgram } from '@/components/landingpage/CourseSlideshow'
import { ContactSection } from '@/components/landingpage/ContactSection'
import { pricingPlans } from '../neurosmm/PricingPlans'

const autor = {
  name: 'Дмитрий НейроКодер',
  role: 'Full Stack разработчик',
  experience: '10+ лет опыта',
  bonusDescription:
    'PDF-книга «10 способов заработка на текстовых и графических нейросетях»',
  imageUrl:
    'https://yuukfqcsdhkyxegfwlcb.supabase.co/storage/v1/object/public/landingpage/ava.jpg',
  description:
    'Full Stack разработчик с более чем 10-летним опытом. Автор первого курса по React Native и AWS Amplify в русскоязычном интернете. Член программы AWS Community Builders от Amazon. Основатель нескольких успешных IT-проектов.',
  achievements: [
    'Full Stack Developer',
    'AI Эксперт',
    'Международный опыт',
    'Основатель',
  ],
  achievementDescriptions: {
    'Full Stack Developer': 'React Native, AWS, Web3',
    'AI Эксперт': 'Интеграция ИИ в приложения',
    'Международный опыт': 'Работа в UAE, Thailand, Indonesia',
    Основатель: 'Leela Chakra AI, NeuroCoder, NeuroBlogger',
  },
  title: 'SMM НА АВТОПИЛОТЕ',
  subtitle: 'АВАТАР ВЕДЕТ БЛОГ ЗА ВАС',
  bonusTitle: 'БОНУС ПРИ РЕГИСТРАЦИИ',
  neurosmmDescription:
    'AI контент производство для блогеров, бизнеса и экспертов',
}

const problemData = {
  titles: [
    'Нехватка времени',
    'Сложности с командой',
    'Падение охватов',
    'Качество контента',
    'Низкая вовлеченность',
    'Низкая вовлечённость и конверсии',
  ],
  descriptions: [
    'Создание регулярного контента отнимает слишком много ресурсов',
    'Найти профессионалов, которые справятся со всем SMM-процессом, сложно',
    'Алгоритмы соцсетей перестают показывать ваши посты',
    'Не хватает визуальной эстетики и идеальных текстов',
    'Подписчики редко взаимодействуют с контентом',
    'Подписчики не реагируют на контент и не становятся клиентами',
  ],
}

function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-white'>
      <MainMenu />
      {/* Hero Section */}
      <section className='relative overflow-hidden px-4 pb-3 pt-20'>
        <div className='relative mx-auto max-w-7xl text-center'>
          <AudienceTags />
        </div>
      </section>

      <section className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <HeroIntensive
            author={autor}
            title={autor.title}
            subtitle={autor.subtitle}
            bonusTitle={autor.bonusTitle}
            description={autor.neurosmmDescription}
          />
        </div>
      </section>

      {/* Problem Section */}
      <section id='problem-section' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <ProblemSection problemData={problemData} />
        </div>
      </section>

      {/* Solution Section */}
      <section id='solution-section' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <SolutionSection />
        </div>
      </section>

      {/* Learning Outcomes */}
      <section id='learning-outcomes' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <LearningOutcomes />
        </div>
      </section>

      {/* Course Block */}
      <section id='course-block' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CourseBlock />
        </div>
      </section>

      <section id='course-program' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CourseProgram />
        </div>
      </section>

      {/* FAQ */}
      <section id='faq' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <FAQ />
        </div>
      </section>

      {/* Цена и CTA */}
      <section id='price' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CoursePricing plans={pricingPlans} />
        </div>
      </section>

      <section id='author-section' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <AuthorSection author={autor} />
        </div>
      </section>

      <section id='contacts' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <ContactSection />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
