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

import cn from 'classnames'
import styleUtils from './utils.module.css'
import styles from './hero.module.css'
import { BRAND_NAME, SITE_DESCRIPTION } from '@lib/constants'
import { useUser } from '@/hooks/useUser'

export default function Hero() {
  const { language_code } = useUser()
  return (
    <div className={styles.wrapper}>
      {/* <h2
        className={cn(
          styleUtils.appear,
          styleUtils['appear-third'],
          styleUtils['show-on-mobile'],
          styles.description
        )}
      >
        {SITE_DESCRIPTION}
      </h2> */}
      <h1
        className={cn(
          styleUtils.appear,
          styleUtils['appear-third'],
          styles.hero
        )}
      >
        Bank of Digital
      </h1>
      <h1 className={cn(styleUtils.appear, styleUtils['brand'], styles.hero)}>
        {BRAND_NAME}
      </h1>

      <h1
        className={cn(
          styleUtils.appear,
          styleUtils['appear-third'],
          styles.hero
        )}
      >
        Avatars
      </h1>
      <div style={{ height: 20 }}></div>
      <div
        className={cn(
          styleUtils.appear,
          styleUtils['appear-fourth'],
          styles.info
        )}
      >
        {language_code === 'ru'
          ? 'Банк ИИ Аватаров'
          : 'Where Immortality is Banked'}
      </div>
      <div style={{ height: 20 }}></div>
    </div>
  )
}
