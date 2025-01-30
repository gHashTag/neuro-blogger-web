import { ProblemSection } from '@/components/landingpage/ProblemSection'
import { SolutionSection } from '@/components/landingpage/SolutionSection'
import { FAQ } from '@/components/landingpage/FAQ'
import { Footer } from '@/components/landingpage/Footer'

import { AuthorSection } from '@/components/landingpage/AuthorSection'
import { HeroIntensive } from '@/components/landingpage/HeroIntensive'
import { AudienceTags } from '@/components/landingpage/AudienceTags'
import { MainMenu } from '@/components/landingpage/MainMenu'
import { ContactSection } from '@/components/landingpage/ContactSection'
import { OfferPage } from '@/components/landingpage/OfferPage'
import { ServiceBenefits } from '@/components/landingpage/ServiceBenefits'
import { PricingSection } from '@/components/landingpage/PricingSection'

import { useRouter } from 'next/router'
import {
  neuroCoderAutor,
  metaMuseAutor,
  playomAutor,
  Author,
  initialAuthorState,
} from '@/data'
import { useEffect, useState } from 'react'
import { NeuroCallsSolutionSection } from '@/components/neurocalls/NeuroCallsSolutionSection'
import { NeuroCallsOfferPage } from '@/components/neurocalls/NeuroCallsOfferPage'
import { NeuroCallsServiceBenefits } from '@/components/neurocalls/NeuroCallsServiceBenefits'
import { NeuroCallsPricingSection } from '@/components/neurocalls/NeuroCallsPricingSection'
import { NeuroCallsFAQ } from '@/components/neurocalls/NeuroCallsFAQ'

const description = {
  title: 'НЕЙРО-ЗВОНКИ',
  subtitle: 'АВТОМАТИЗАЦИЯ БИЗНЕС-ПРОЦЕССОВ',
  bonusTitle: `СВОБОДА И МЕДИЙНОСТЬ В ПОДАРОК ПРИ РЕГИСТРАЦИИ`,
  neurosmmDescription:
    'Автоматическая расшифровка разговоров, обобщение ключевых моментов, извлечение задач и интеграция с чат-ботом для эффективного взаимодействия и управления данными.',
  imageTitle: 'СТАНЬ ИИ-ЭКСПЕРТОМ',
  bonusTitleOne: `СВОБОДА И МЕДИЙНОСТЬ`,
  bonusTitleTwo: `В ПОДАРОК ПРИ РЕГИСТРАЦИИ`,
  bonusTitleThree: `Живи, люби, твори - за тебя работает ИИ`,
  quote: `Живи, люби, твори - за тебя работает ИИ`,
}

export const problemData = {
  intro:
    '95% компаний сталкиваются с этими проблемами ежедневно. Но теперь есть решение',
  titles: [
    'Нехватка времени',
    'Сложности с командой',
    'Падение продуктивности',
    'Качество работы',
    'Низкая вовлеченность',
    'Низкая конверсия',
  ],
  descriptions: [
    'Управление задачами и проектами отнимает слишком много ресурсов',
    'Найти профессионалов, которые справятся со всеми бизнес-процессами, сложно',
    'Сотрудники не успевают выполнять все задачи вовремя',
    'Не хватает автоматизации и оптимизации процессов',
    'Сотрудники редко взаимодействуют с новыми инструментами',
    'Клиенты не реагируют на предложения и не становятся постоянными',
  ],
}

function Home() {
  const [currentAuthor, setCurrentAuthor] = useState<Author>(initialAuthorState)
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    const newpathname = router.asPath

    const username = newpathname ? newpathname.split('/')[1] : null
    console.log(username, 'username')
    setUsername(username)

    let author
    switch (username) {
      case 'neuro_sage':
        author = neuroCoderAutor
        break
      case 'muse_nataly':
        author = metaMuseAutor
        break
      case 'playom':
        author = playomAutor
        break
      default:
        author = neuroCoderAutor
    }
    setCurrentAuthor(author as Author)
    console.log(author, 'currentAuthor')
  }, [router.isReady])

  if (!router.isReady) return <p>Loading...</p>

  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-white'>
      <MainMenu />

      <section className='relative overflow-hidden px-4 pb-3 pt-20'>
        <div className='relative mx-auto max-w-7xl text-center'>
          <AudienceTags />
        </div>
      </section>
      <section className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          {currentAuthor && (
            <HeroIntensive
              imageUrl={currentAuthor.imageUrl}
              description={description}
            />
          )}
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
          <NeuroCallsSolutionSection />
        </div>
      </section>
      {/* Learning Outcomes */}
      <section id='learning-outcomes' className='px-4'>
        <div className='mx-auto max-w-7xl'>
          <NeuroCallsOfferPage />
        </div>
      </section>
      <section id='service-benefits' className='px-4x'>
        <div className='mx-auto max-w-7xl'>
          <NeuroCallsServiceBenefits />
        </div>
      </section>
      <section id='pricing' className='px-4'>
        <div className='max-w-1xl mx-auto'>
          <NeuroCallsPricingSection />
        </div>
      </section>
      {/* FAQ */}
      <section id='faq' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <NeuroCallsFAQ />
        </div>
      </section>
      {/* Цена и CTA */}
      {/* <section id='price' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CoursePricing plans={pricingNeuroSmm} />
        </div>
      </section> */}

      <section id='author-section' className='px-8 py-10'>
        <div className='mx-auto max-w-7xl'>
          <h2 className='mb-8 text-center text-4xl font-bold text-gray-800 sm:text-5xl lg:text-6xl'>
            Команда
          </h2>
          <AuthorSection author={neuroCoderAutor} />
        </div>
      </section>
      {currentAuthor && username !== 'neuro_sage' && (
        <>
          <section id='meta-muse-section' className='px-4'>
            <div className='mx-auto max-w-7xl'>
              <AuthorSection author={currentAuthor} side='right' />
            </div>
          </section>

          <section id='contacts' className='px-4 py-5'>
            <div className='mx-auto max-w-7xl'>
              <ContactSection
                title='Готовы вывести свой бизнес на новый уровень?'
                description='Оставьте заявку прямо сейчас и станьте одним из первых, кто воспользуется уникальным решением!'
                contact={currentAuthor.telegram}
              />
            </div>
          </section>
        </>
      )}
      {/* Footer */}
      <Footer />
      {/* <AIWidget /> */}
    </div>
  )
}

export default Home
