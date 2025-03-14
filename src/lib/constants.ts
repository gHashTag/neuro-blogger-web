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

import {
  NEXT_PUBLIC_COPYRIGHT_HOLDER,
  NEXT_PUBLIC_PRIVACY_POLICY_URL,
  NEXT_PUBLIC_SITE_URL,
} from '@/config'

export const SITE_URL = 'https://dao999nft.com/'
export const SITE_ORIGIN = NEXT_PUBLIC_SITE_URL || new URL(SITE_URL).origin
export const TWITTER_USER_NAME = 'dao999nft'
export const BRAND_NAME = 'DAO999NFT'
export const SITE_NAME_MULTILINE = ['dao999nft']
export const SITE_NAME = 'dao999nft'
export const META_DESCRIPTION =
  'This is an open source demo that Next.js developers can clone, deploy, and fully customize for events. Created through collaboration of marketers, designers, and developers at Vercel.'
export const SITE_DESCRIPTION =
  'An interactive online experience by the community, free for everyone.'
export const DATE = '08 March 2024'
export const SHORT_DATE = 'Jan 1 - 9:00am PST'
export const FULL_DATE = 'Jan 1st 9am Pacific Time (GMT-7)'
export const TWEET_TEXT = META_DESCRIPTION
export const COOKIE = 'user-id'

// Remove process.env.NEXT_PUBLIC_... below and replace them with
// strings containing your own privacy policy URL and copyright holder name
export const LEGAL_URL = NEXT_PUBLIC_PRIVACY_POLICY_URL
export const COPYRIGHT_HOLDER = NEXT_PUBLIC_COPYRIGHT_HOLDER

// export const CODE_OF_CONDUCT =
//   "https://www.notion.so/vercel/Code-of-Conduct-Example-7ddd8d0e9c354bb597a0faed87310a78";
export const REPO = 'https://github.com/gHashTag'
export const SAMPLE_TICKET_NUMBER = 1234

export const NAVIGATION = [
  {
    name: 'Meets',
    route: '/office',
  },
  {
    name: 'Tasks',
    route: '/tasks',
  },
  // {
  //   name: "Schedule",
  //   route: "/schedule",
  // },
  {
    name: 'Wallet',
    route: '/wallet',
  },
  // {
  //   name: "Speakers",
  //   route: "/speakers",
  // },
  // {
  //   name: "Vercel Stage",
  //   route: "/stage/c",
  // },
  // {
  //   name: "100ms Stage",
  //   route: "/stage/m",
  // },

  // {
  //   name: "Expo",
  //   route: "/expo",
  // },
  // {
  //   name: "Jobs",
  //   route: "/jobs",
  // },
]

export type TicketGenerationState = 'default' | 'loading'
