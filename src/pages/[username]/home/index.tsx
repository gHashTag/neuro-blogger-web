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
import { PricingPlans } from '@/components/landingpage/CoursePricing/PricingPlans'
import {
  playomAutor,
  metaMuseAutor,
  neuroCoderAutor,
  problemData,
  initialAuthorState,
  ryabinikaAutor,
  Author,
  ezavarykinAutor,
} from '@/data'

import { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/loader'

const description = {
  title: 'НЕЙРОСЕТИ ОБУЧЕНИЕ С НУЛЯ',
  imageTitle: 'СТАНЬ ИИ-ЭКСПЕРТОМ',
  subtitle:
    'Искусственный интеллект — простой инструмент для ускорения работы и увеличения дохода',
  bonusTitleOne: `СВОБОДА И МЕДИЙНОСТЬ`,
  bonusTitleTwo: `В ПОДАРОК ПРИ РЕГИСТРАЦИИ`,
  bonusTitleThree: `Живи, люби, твори - за тебя работает ИИ`,
  quote: `Живи, люби, твори - за тебя работает ИИ`,
  neurosmmDescription:
    'AI контент производство для блогеров, бизнеса и экспертов',
}

function Home() {
  const [currentAuthor, setCurrentAuthor] = useState<Author>(initialAuthorState)
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    const newpathname = router.asPath

    const username = newpathname ? newpathname.split('/')[1] : null
    console.log(username, 'username')

    let author
    switch (username) {
      case 'neuro_sage':
        author = neuroCoderAutor
        break
      case 'muse_nataly':
        author = metaMuseAutor
        break
      case 'E_Zavarykin':
        author = ezavarykinAutor
        break
      case 'playom':
        author = playomAutor
        break
      case 'Ryabinika_Perm':
        author = ryabinikaAutor
        break
      default:
        author = metaMuseAutor
    }
    setCurrentAuthor(author)
    console.log(author, 'currentAuthor')
  }, [router.isReady])

  if (!router.isReady) return <Loader />

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
        {currentAuthor && (
          <div className='mx-auto max-w-7xl'>
            <HeroIntensive
              imageUrl={currentAuthor.imageUrl}
              description={description}
            />
          </div>
        )}
      </section>
      {/* <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm'>
        <h1 className='mb-8 text-center text-4xl font-bold'>
          ElevenLabs Conversational AI
        </h1>
        <Conversation />
      </div> */}

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
          <CoursePricing plans={PricingPlans} />
        </div>
      </section>
      {currentAuthor && (
        <>
          <section id='author-section' className='px-4 py-5'>
            <div className='mx-auto max-w-7xl'>
              <AuthorSection author={currentAuthor} />
            </div>
          </section>

          <section id='contacts' className='px-4 py-5'>
            <div className='mx-auto max-w-7xl'>
              <ContactSection
                title='Готовы вывести свой бизнес на новый уровень?'
                description='Оставьте заявку прямо сейчас и станьте одним из первых, кто воспользуется уникальным решением!'
                contact={currentAuthor.telegram}
                hidePrice={true}
              />
            </div>
          </section>
        </>
      )}
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
