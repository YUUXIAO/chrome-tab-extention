import { config } from 'dotenv'
import React, { FC } from 'react'

interface PopoverConfigOption {
  key: string
  val: string
}

interface BtnPopoverOption {
  key: string
  title: string
}

interface BtnPopoverProps {
  title: string
  config: PopoverConfigOption
  content: React.ReactNode | BtnPopoverOption[]
}

type PopoverPlacement = 'top' | 'left' | 'right' | 'bottom'

const BtnPopover: React.FC<BtnPopoverProps> = ({ title, content, config }) => {
  return (
    <div className='btn-popover-wrapper relative'>
      {title && <div className='btn'>{title}</div>}
      <div className='content'>
        {content.map(i => {
          return <div key={i[config.key] || i.key}>{i.title}</div>
        })}
      </div>
    </div>
  )
}

export default BtnPopover
