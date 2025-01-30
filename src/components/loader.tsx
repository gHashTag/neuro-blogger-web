import React from 'react'
import { Atom } from 'react-loading-indicators'

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        color: 'black',
        backgroundColor: 'white',
      }}
    >
      <p>No level data available</p>

      <Atom color='#000000' size='medium' text='No Data' />
    </div>
  )
}

export default Loader
