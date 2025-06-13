import React from 'react'
import './style.css'

const SpotifyMessage = ({
  width = 300,
  height = 380,
  ...props
}) => {
  const toUrl = () => {
    var formBody = []
    for (var property in props) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(props[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }

    return formBody.join('&')
  }

  if (!props.uri) return null
  return (
    <div className='rce-mbox-spotify'>
      <iframe
        src={'https://open.spotify.com/embed?' + toUrl()}
        width={width}
        height={height}
        frameBorder='0'
        allowTransparency={true}
      ></iframe>
    </div>
  )
}

export default SpotifyMessage
