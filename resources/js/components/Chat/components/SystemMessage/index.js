import classNames from 'classnames'
import React from 'react'
import './style.css'

const SystemMessage = props => {
  return (
    <div className={classNames('rce-container-smsg', props.className)}>
      <div className='rce-smsg'>
        <div className='rce-smsg-text'>{props.text}</div>
      </div>
    </div>
  )
}

export default SystemMessage
