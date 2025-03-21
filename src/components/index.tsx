/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react'

import Layout from './layout'

import Hero from './hero'
import Form from './form'
import LearnMore from './learn-more'
import { useReactiveVar } from '@apollo/client'
import { setLoggedIn, setVisibleHeader } from '@/store/reactive-store'

import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function Conf() {
  const loggedIn = useReactiveVar(setLoggedIn)
  const { username, telegram_id } = useUser()
  const router = useRouter()

  useEffect(() => {
    console.log('username', username)
    if (username) {
      router.push(`/${username}/${telegram_id}`)
    }
    if (!loggedIn) {
      setVisibleHeader(false)
    }
  }, [loggedIn])

  return (
    <Layout loading={false}>
      {loggedIn ? (
        <div className='flex h-screen items-center justify-center'>
          <Globe />
        </div>
      ) : (
        <>
          <Hero />
          <Form />
        </>
      )}
    </Layout>
  )
}
