import { useState } from 'react'

const useLocalStorage = (key: string, initialValue: any) => {
  const [state, setState] = useState(() => {
    // Initialize the state
    try {
      const value = window.localStorage.getItem(key)
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: string | ((prevState: any) => any)) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore = typeof value === 'function' ? value(state) : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      setState(value)
    } catch (error) {
      console.log(error)
    }
  }

  return [state, setValue]
}

export { useLocalStorage }
