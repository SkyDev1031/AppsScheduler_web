import React from 'react'
import ChatItem from '../ChatItem'
import classNames from 'classnames'
import './style.css'

const ChatList = props => {
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
  const sort = (a, b) => {
    if(!b?.date) return 1;
    if(!a?.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
  return (
    <div className={classNames('rce-container-clist', props.className)}>
      {props.dataSource.sort(sort).map((x, i) => (
        <ChatItem
          {...x}
          key={i}
          onAvatarError={(e) => onAvatarError(x, i, e)}
          onContextMenu={(e) => onContextMenu(x, i, e)}
          onClick={(e) => onClick(x, i, e)}
          onClickMute={(e) => props.onClickMute?.(x, i, e)}
          onClickVideoCall={(e) => props.onClickVideoCall?.(x, i, e)}
          onDragOver={props?.onDragOver}
          onDragEnter={props?.onDragEnter}
          onDrop={props.onDrop}
          onDragLeave={props.onDragLeave}
          onDragComponent={props.onDragComponent}
        />
      ))}
    </div>
  )
}

export default ChatList
