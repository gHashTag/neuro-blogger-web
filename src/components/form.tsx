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

import { useState, useCallback, useRef, useEffect } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
// import LoadingDots from "./loading-dots";
import styleUtils from './utils.module.css'
import styles from './form.module.css'
import { Spinner } from '@/components/ui/spinner'

import { useReactiveVar } from '@apollo/client'
import {
  // openWeb3ModalVar,
  setInviteCode,
  setUserId,
  visibleSignInVar,
  setInviterUserInfo,
} from '@/store/reactive-store'

import Captcha, { useCaptcha } from './captcha'

import { useUser } from '@/hooks/useUser'
import { checkUsernameAndReturnUser } from '@/core/supabase/supabase'
import { isValidEmail } from '@/helpers/utils'
import { isDev } from '@/config'

type FormState = 'default' | 'loading' | 'error' | 'success'

type Props = {
  sharePage?: boolean
}

export default function Form({ sharePage }: Props) {
  const { toast } = useToast()

  const visible = useReactiveVar(visibleSignInVar)
  const workspace_id = useReactiveVar(setUserId)
  const userInfo = useReactiveVar(setInviterUserInfo)

  const inviteCode = useReactiveVar(setInviteCode)

  const [errorMsg, setErrorMsg] = useState('')
  const [errorTryAgain, setErrorTryAgain] = useState(false)
  const [focused, setFocused] = useState(false)
  const [formState, setFormState] = useState<FormState>('default')

  const [isEmailStep, setIsEmailStep] = useState(false)

  const router = useRouter()
  const {
    ref: captchaRef,
    execute: executeCaptcha,
    reset: resetCaptcha,
    isEnabled: isCaptchaEnabled,
  } = useCaptcha()

  const email = isDev ? 'neuro_sage@gmail.com' : ''
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputRefWord = useRef<HTMLInputElement | null>(null)
  const { username, telegram_id, language_code } = useUser()

  useEffect(() => {
    if (workspace_id) {
      router.push(`/${username}/${telegram_id}`)
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (inputRefWord.current) {
      inputRefWord.current.focus()
    }
  }, [router, workspace_id])

  const checkEmail = useCallback(async () => {
    if (inviteCode) {
      const isInviterExist = isValidEmail(inviteCode)
      if (isInviterExist) {
        visibleSignInVar(true)
        setFormState('success')
        setInviterUserInfo({
          ...userInfo,
          email: inviteCode,
        })
      } else {
        setErrorMsg(
          `${
            language_code === 'ru' ? 'Email некорректный' : 'Email not correct'
          }`
        )
        setFormState('error')
        setTimeout(() => setFormState('default'), 2000)
        return
      }
    }
  }, [inviteCode, toast])

  const checkInviteWord = useCallback(async () => {
    if (inviteCode) {
      setFormState('loading')
      const { isUserExist: isInviterExist, user } =
        await checkUsernameAndReturnUser(inviteCode)

      if (isInviterExist) {
        const { select_izbushka, telegram_id } = user
        setIsEmailStep(true)
        setTimeout(() => {
          setFormState('default')
          setInviteCode('')
          setFocused(true)
          setInviterUserInfo({
            select_izbushka: select_izbushka || '',
            inviter: telegram_id ? telegram_id.toString() : '',
            is_bot: false,
          })
        }, 1000)
      } else {
        setErrorMsg(
          `${
            language_code === 'ru'
              ? 'Код некорректный'
              : 'Invite code not correct'
          }`
        )
        setFormState('error')
        return
      }
    }
  }, [inviteCode])

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (formState === 'default') {
        setFormState('loading')

        if (isCaptchaEnabled) {
          return executeCaptcha()
        }
        return isEmailStep ? checkEmail() : checkInviteWord()
      } else {
        setFormState('default')
      }
    },
    [
      formState,
      isCaptchaEnabled,
      isEmailStep,
      checkEmail,
      checkInviteWord,
      executeCaptcha,
    ]
  )

  const onTryAgainClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      setFormState('default')
      setErrorTryAgain(true)
      resetCaptcha()
    },
    [resetCaptcha]
  )

  const EmailStep = () => {
    return (
      <>
        {!visible ? (
          <form
            className={cn(styles.form, {
              [styles['share-page']]: sharePage,
              [styleUtils.appear]: !errorTryAgain,
              [styleUtils['appear-fifth']]: !errorTryAgain && !sharePage,
              [styleUtils['appear-third']]: !errorTryAgain && sharePage,
            })}
            onSubmit={onSubmit}
          >
            <div className={styles['form-row']}>
              <label
                htmlFor='email-input-field'
                className={cn(styles['input-label'], {
                  [styles.focused]: focused,
                })}
              >
                <input
                  ref={inputRef}
                  className={`${styles.input}`}
                  autoComplete='off'
                  type='email'
                  id='email-input-field'
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={
                    language_code === 'ru' ? 'Введите email' : 'Enter email'
                  }
                  aria-label='Your invite email address'
                  required
                />
              </label>
              <div className='px-4 sm:px-8'>
                <Button
                  type='submit'
                  className={cn(
                    'w-full rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75',
                    'sm:px-6 sm:py-3 sm:text-lg',
                    'md:px-8 md:py-4 md:text-xl',
                    'lg:px-10 lg:py-5 lg:text-2xl',
                    styles[formState]
                  )}
                  disabled={formState === 'loading'}
                >
                  <p className='text-center'>
                    {language_code === 'ru' ? 'Проверка' : 'Check'}
                  </p>
                </Button>
              </div>
            </div>
            <Captcha ref={captchaRef} onVerify={checkEmail} />
          </form>
        ) : null}
      </>
    )
  }

  const WordStep = () => {
    return (
      <>
        {!visible ? (
          <form
            className={cn(styles.form, {
              [styles['share-page']]: sharePage,
              [styleUtils.appear]: !errorTryAgain,
              [styleUtils['appear-fifth']]: !errorTryAgain && !sharePage,
              [styleUtils['appear-third']]: !errorTryAgain && sharePage,
            })}
            onSubmit={onSubmit}
          >
            <div className={styles['form-row']}>
              <label
                htmlFor='email-input-field'
                className={cn(styles['input-label'], {
                  [styles.focused]: focused,
                })}
              >
                <input
                  ref={inputRefWord}
                  className={`${styles.input}`}
                  autoComplete='off'
                  type='text'
                  id='invite-word-input-field'
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={
                    language_code === 'ru'
                      ? 'Введите код приглашения'
                      : 'Enter invite code'
                  }
                  aria-label='Your invite code'
                  required
                />
              </label>
              <Button
                type='submit'
                className={cn(
                  styles.submit,
                  styles.register,
                  styles[formState]
                )}
                disabled={formState === 'loading'}
              >
                <p className={styles['register-text']}>
                  {language_code === 'ru' ? 'Проверка' : 'Check'}
                </p>
              </Button>
            </div>
            <Captcha ref={captchaRef} onVerify={checkInviteWord} />
          </form>
        ) : null}
      </>
    )
  }

  const ErrorState = () => {
    return (
      <div
        className={cn(styles.form, {
          [styles['share-page']]: sharePage,
        })}
      >
        <div className={styles['form-row']}>
          <div className={cn(styles['input-label'], styles.error)}>
            <div className={cn(styles.input, styles['input-text'])}>
              {errorMsg}
            </div>
            <Button
              type='button'
              className={cn(styles.submit, styles.register, styles.error)}
              onClick={onTryAgainClick}
            >
              {language_code === 'ru' ? 'Еще раз' : 'Try Again'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    if (formState === 'success') {
      return
    }
    if (formState === 'loading') {
      return <Spinner size='sm' />
    }
    if (formState === 'error') {
      return ErrorState()
    } else {
      return isEmailStep ? EmailStep() : WordStep()
    }
  }
  return renderPage()
}
