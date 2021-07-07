import React, { MouseEventHandler } from 'react'

export const LightboxComponent = ({ url, onClick }: {url: string, onClick: MouseEventHandler }) => {
  return (
    <div className="lightbox" onClick={onClick}>
      <img src={url} alt="Image" />
    </div>
  )
}