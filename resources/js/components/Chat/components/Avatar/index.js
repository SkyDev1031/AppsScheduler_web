import classNames from 'classnames';
import React, { memo, useState } from 'react';
import { IMAGES } from '../../assets';
import { getTitle } from '../../utils';
import './style.css';

const Avatar = ({ type = 'default', size = 'default', ...props }) => {
  const [failed, setFailed] = useState(!props.src)

  const onFailed = (err) => {
    setFailed(true);
    if (typeof props.onError === 'function') props.onError(err);
  }


  const stringToColour = (str) => {
    var hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    var colour = '#'
    for (let i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xff
      value = (value % 150) + 50
      colour += ('00' + value.toString(16)).substr(-2)
    }
    return colour
  }
  return (
    <div className={classNames('rce-avatar-container', type, size, props.className)}>
      {!failed ?
        <img
          alt={props.alt}
          src={props.src}
          onError={onFailed}
          className={classNames('rce-avatar')}
        />
        :
        <div className='loading'>
          {props.title ?
            <div className='rce-avatar-letter-background' style={{ backgroundColor: stringToColour(props.title) }}>
              <span className='rce-avatar-letter'>{getTitle(props.title)}</span>
            </div>
            :
            <img src={IMAGES.avatar} className={classNames('rce-avatar')}
            />
          }
        </div>
      }
      {props.sideElement}
    </div>
  )
}
export default memo(Avatar)
