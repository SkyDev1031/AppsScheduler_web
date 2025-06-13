import classNames from 'classnames'
import React from 'react'
import MeetingItem from '../MeetingItem'
import './style.css'

const MeetingList = props => {
  const onClick = (item, index, event) => {
    if (props.onClick instanceof Function) props.onClick(item, index, event)
  }

  const onContextMenu = (item, index, event) => {
    event.preventDefault()
    if (props.onContextMenu instanceof Function) props.onContextMenu(item, index, event)
  }

  const onAvatarError = (item, index, event) => {
    if (props.onAvatarError instanceof Function) props.onAvatarError(item, index, event)
  }

  const onMeetingClick = (item, index, event) => {
    if (props.onMeetingClick instanceof Function) props.onMeetingClick(item, index, event)
  }

  const onShareClick = (item, index, event) => {
    if (props.onShareClick instanceof Function) props.onShareClick(item, index, event)
  }

  const onCloseClick = (item, index, event) => {
    if (props.onCloseClick instanceof Function) props.onCloseClick(item, index, event)
  }

  return (
    <div ref={props.cmpRef} className={classNames('rce-container-mtlist', props.className)}>
      {props.dataSource?.map((x, i) => (
        <MeetingItem
          key={i}
          {...x}
          onAvatarError={(e) => onAvatarError(x, i, e)}
          onContextMenu={(e) => onContextMenu(x, i, e)}
          onClick={(e) => onClick(x, i, e)}
          onMeetingClick={(e) => onMeetingClick(x, i, e)}
          onShareClick={(e) => onShareClick(x, i, e)}
          onCloseClick={(e) => onCloseClick(x, i, e)}
        />
      ))}
    </div>
  )
}

export default MeetingList
