import { useEffect, useState } from 'react'
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
  Author,
  initialAuthorState,
  metaMuseAutor,
  problemData,
  neuroCoderAutor,
  playomAutor,
  ezavarykinAutor,
} from '@/data'
import Loader from '@/components/loader'

const description = {
  title: 'SMM НА АВТОПИЛОТЕ',
  subtitle: 'АВАТАР ВЕДЕТ БЛОГ ЗА ВАС',
  bonusTitle: 'СВОБОДА И МЕДИЙНОСТЬ В ПОДАРОК ПРИ РЕГИСТРАЦИИ',
  neurosmmDescription:
    'Погружайтесь в обучение и игру под руководством нейрокоуча Гаи Камской.',
  imageTitle: 'СТАНЬ ИИ-ЭКСПЕРТОМ',
  bonusTitleOne: `СВОБОДА И МЕДИЙНОСТЬ`,
  bonusTitleTwo: `В ПОДАРОК ПРИ РЕГИСТРАЦИИ`,
  bonusTitleThree: `Живи, люби, твори - за тебя работает ИИ`,
  quote: `AI контент производство для блогеров, бизнеса и экспертов`,
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
      case 'muse_nataly':
        author = metaMuseAutor
        break
      case 'playom':
        author = playomAutor
        break
      case 'E_Zavarykin':
        author = ezavarykinAutor
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
          <SolutionSection />
        </div>
      </section>
      {/* Learning Outcomes */}
      <section id='learning-outcomes' className='px-4'>
        <div className='mx-auto max-w-7xl'>
          <OfferPage />
        </div>
      </section>
      <section id='service-benefits' className='px-4x'>
        <div className='mx-auto max-w-7xl'>
          <ServiceBenefits />
        </div>
      </section>
      <section id='pricing' className='px-4'>
        <div className='max-w-1xl mx-auto'>
          <PricingSection />
        </div>
      </section>
      {/* FAQ */}
      <section id='faq' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <FAQ />
        </div>
      </section>
      {/* Цена и CTA */}
      {/* <section id='price' className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          <CoursePricing plans={pricingNeuroSmm} />
        </div>
      </section> */}
      <section id='author-section' className='px-4'>
        <div className='mx-auto max-w-7xl'>
          <AuthorSection author={neuroCoderAutor} />
        </div>
      </section>
      {currentAuthor && (
        <>
          <section id='meta-muse-section' className='px-4'>
            <div className='mx-auto max-w-7xl'>
              <AuthorSection author={currentAuthor} side='right' />
            </div>
          </section>

          <section id='contacts' className='px-4 py-5'>
            <div className='mx-auto max-w-7xl'>
              <ContactSection
                title='Готовы вывести SMM на новый уровень?'
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
