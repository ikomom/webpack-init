import React from 'react'

import './index.css'

const BackgroundCell = () => {
  return (
    <div className="background-item">
      <div className="header">
      </div>
      <div className="body">
      </div>
    </div>
  )
}

const Background = () => {
  return (
    <div className="background">
      <BackgroundCell/>
    </div>
  )
}

export default Background