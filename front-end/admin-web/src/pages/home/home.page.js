import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetSession } from 'store/modules/session/session.actions'
import { tokenExpired } from 'utils/helpers'
import { getStorage, localStorageKeys } from 'utils/localStorage.helpers'
function HomePage (props) {
  const dispatch = useDispatch()

  useEffect(() => {
    const isTokenExpired = checkTokenExpired()
    if (isTokenExpired) {
      dispatch(resetSession())
      props.history.push('/login')
    }
  }, [])

  const checkTokenExpired = () => {
    let isTokenExpired = true
    const token = getStorage(localStorageKeys.TOKEN)
    if (token || token !== null) {
      isTokenExpired = tokenExpired(token)
    }
    return isTokenExpired
  }

  return (
    <>Homepage</>
  )
}

export default HomePage
