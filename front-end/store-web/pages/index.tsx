import SEO from '@/components/Layout/SEO'
import React from 'react'
import { counterActions } from '@/redux/features/counterSlice'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'

const HomePage = () => {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      {/* <h1>Home Page</h1>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(counterActions.decrement())}>
        Decrement
      </button>
      <button onClick={() => dispatch(counterActions.increment())}>
        Increment
      </button> */}
    </>
  )
}

export default HomePage
