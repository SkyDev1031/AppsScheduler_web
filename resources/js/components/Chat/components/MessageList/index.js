import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import MessageBox from '../MessageBox'
import './style.css'

const MessageList = ({ referance = null, lockable = false, toBottomHeight = 300, downButton, ...props }) => {
  const [scrollBottom, setScrollBottom] = useState(0)
  const [_downButton, setDownButton] = useState(false)
  const prevProps = useRef(props)

  const checkScroll = () => {
    var e = referance
    if (!e || !e.current) return

    if (toBottomHeight === '100%' || (toBottomHeight && scrollBottom < toBottomHeight)) {
      e.current.scrollTop = e.current.scrollHeight // scroll to bottom
    } else {
      if (lockable === true) {
        e.current.scrollTop = e.current.scrollHeight - e.current.offsetHeight - scrollBottom
      }
    }
  }

  useEffect(() => {
    if (!referance) return

    if (prevProps.current.dataSource.length !== props.dataSource.length) {
      setScrollBottom(getBottom(referance))
      checkScroll()
    }

    prevProps.current = props
  }, [prevProps, props])

  const getBottom = (e) => {
    if (e.current) return e.current.scrollHeight - e.current.scrollTop - e.current.offsetHeight
    return e.scrollHeight - e.scrollTop - e.offsetHeight
  }

  const onOpen = (item, index, event) => {
    if (props.onOpen instanceof Function) props.onOpen(item, index, event)
  }

  const onDownload = (item, index, event) => {
    if (props.onDownload instanceof Function) props.onDownload(item, index, event)
  }

  const onPhotoError = (item, index, event) => {
    if (props.onPhotoError instanceof Function) props.onPhotoError(item, index, event)
  }

  const onClick = (item, index, event) => {
    if (props.onClick instanceof Function) props.onClick(item, index, event)
  }

  const onTitleClick = (item, index, event) => {
    if (props.onTitleClick instanceof Function) props.onTitleClick(item, index, event)
  }

  const onForwardClick = (item, index, event) => {
    if (props.onForwardClick instanceof Function) props.onForwardClick(item, index, event)
  }

  const onReplyClick = (item, index, event) => {
    if (props.onReplyClick instanceof Function) props.onReplyClick(item, index, event)
  }

  const onEditClick = (item, index, event) => {
    if (props.onEditClick instanceof Function) props.onEditClick(item, index, event)
  }

  const onReplyMessageClick = (item, index, event) => {
    if (props.onReplyMessageClick instanceof Function) props.onReplyMessageClick(item, index, event)
  }

  const onRemoveMessageClick = (item, index, event) => {
    if (props.onRemoveMessageClick instanceof Function) props.onRemoveMessageClick(item, index, event)
  }

  const onContextMenu = (item, index, event) => {
    if (props.onContextMenu instanceof Function) props.onContextMenu(item, index, event)
  }

  const onMessageFocused = (item, index, event) => {
    if (props.onMessageFocused instanceof Function) props.onMessageFocused(item, index, event)
  }

  const onMeetingMessageClick = (item, index, event) => {
    if (props.onMeetingMessageClick instanceof Function) props.onMeetingMessageClick(item, index, event)
  }

  const onScroll = (e) => {
    var bottom = getBottom(e.currentTarget)
    setScrollBottom(bottom)
    if (toBottomHeight === '100%' || (toBottomHeight && bottom > toBottomHeight)) {
      if (_downButton !== true) {
        setDownButton(true)
        setScrollBottom(bottom)
      }
    } else {
      if (_downButton !== false) {
        setDownButton(false)
        setScrollBottom(bottom)
      }
    }

    if (props.onScroll instanceof Function) {
      props.onScroll(e)
    }
  }

  const toBottom = (e) => {
    if (!referance) return
    referance.current.scrollTop = referance.current.scrollHeight
    if (props.onDownButtonClick instanceof Function) {
      props.onDownButtonClick(e)
    }
  }

  const onMeetingMoreSelect = (item, i, e) => {
    if (props.onMeetingMoreSelect instanceof Function) props.onMeetingMoreSelect(item, i, e)
  }

  const onMeetingLinkClick = (item, i, e) => {
    if (props.onMeetingLinkClick instanceof Function) props.onMeetingLinkClick(item, i, e)
  }

  return (
    <div className={classNames(['rce-container-mlist', props.className])} {...props.customProps}>
      {!!props.children && props.isShowChild && props.children}
      <div ref={referance} onScroll={onScroll} className='rce-mlist'>
        {props.dataSource.map((x, i) => (
          <MessageBox
            key={i}
            {...(x)}
            // data={x}
            onOpen={props.onOpen && ((e) => onOpen(x, i, e))}
            onPhotoError={props.onPhotoError && ((e) => onPhotoError(x, i, e))}
            onDownload={props.onDownload && ((e) => onDownload(x, i, e))}
            onTitleClick={props.onTitleClick && ((e) => onTitleClick(x, i, e))}
            onForwardClick={props.onForwardClick && ((e) => onForwardClick(x, i, e))}
            onReplyClick={props.onReplyClick && ((e) => onReplyClick(x, i, e))}
            onEditClick={props.onEditClick && ((e) => onEditClick(x, i, e))}
            onReplyMessageClick={props.onReplyMessageClick && ((e) => onReplyMessageClick(x, i, e))}
            onRemoveMessageClick={props.onRemoveMessageClick && ((e) => onRemoveMessageClick(x, i, e))}
            onClick={props.onClick && ((e) => onClick(x, i, e))}
            onContextMenu={props.onContextMenu && ((e) => onContextMenu(x, i, e))}
            onMeetingMoreSelect={props.onMeetingMoreSelect && ((e) => onMeetingMoreSelect(x, i, e))}
            onMessageFocused={props.onMessageFocused && ((e) => onMessageFocused(x, i, e))}
            onMeetingMessageClick={props.onMeetingMessageClick && ((e) => onMeetingMessageClick(x, i, e))}
            onMeetingTitleClick={props.onMeetingTitleClick}
            onMeetingVideoLinkClick={props.onMeetingVideoLinkClick}
            onMeetingLinkClick={props.onMeetingLinkClick && ((e) => onMeetingLinkClick(x, i, e))}
            actionButtons={props.actionButtons}
            styles={props.messageBoxStyles}
            notchStyle={props.notchStyle}
          />
        ))}
      </div>
      {downButton === true && _downButton && toBottomHeight !== '100%' && (
        <div className='rce-mlist-down-button' onClick={toBottom}>
          <FaChevronDown />
          {props.downButtonBadge !== undefined ? (
            <span className='rce-mlist-down-button--badge'>{props.downButtonBadge.toString()}</span>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default MessageList
