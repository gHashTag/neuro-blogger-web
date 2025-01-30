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
import AIWidget from '@/utils/AIWidget'
import { useRouter } from 'next/router'
import {
  neuroCoderAutor,
  metaMuseAutor,
  playomAutor,
  problemData,
  Author,
} from '@/data'
import { useEffect, useState } from 'react'

function Home() {
  const [currentAuthor, setCurrentAuthor] = useState<Author>(metaMuseAutor)
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
      default:
        author = metaMuseAutor
    }
    setCurrentAuthor(author)
    console.log(author, 'currentAuthor')
  }, [router.isReady])

  if (!router.isReady) return <p>Loading...</p>

  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-white'>
      <MainMenu />
      Hero Section
      <section className='relative overflow-hidden px-4 pb-3 pt-20'>
        <div className='relative mx-auto max-w-7xl text-center'>
          <AudienceTags />
        </div>
      </section>
      <section className='px-4 py-5'>
        <div className='mx-auto max-w-7xl'>
          {currentAuthor && (
            <HeroIntensive
              author={currentAuthor}
              title={currentAuthor.title}
              subtitle={currentAuthor.subtitle}
              bonusTitle={currentAuthor.bonusTitle}
              description={currentAuthor.neurosmmDescription}
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
              <ContactSection contact={currentAuthor.telegram} />
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
