import React, { useState, useEffect } from 'react'

import './Index.less'

interface ContextMenuProps {
  label: string
  menuItems: object[]
}

const ContextMenu = ({ menuItems, onClickFn, clickData, style, menuPosition }) => {
  const onClickMenu = (item, index) => {
    onClickFn()
    // 执行业务里的方法，这里传出索引和数据
    console.error('点击菜单项2', clickData)
    item.action(clickData.target)
  }
  return (
    <div
      className='context-menu'
      style={{
        position: 'absolute',
        zIndex: 1000,
        top: `${menuPosition.y}px`,
        left: `${menuPosition.x}px`,
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          className='menu-item'
          onClick={e => onClickMenu(item, index)}
          style={{
            padding: '4px 8px',
            cursor: 'pointer',
            border: '1px solid #e2e2e2',
            position: 'absolute',
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}

const ContextMenuComponent: React.FC<ContextMenuProps> = props => {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 }) // 鼠标右键位置
  const [isShowContextMenu, setShowContextMenu] = useState(false) // 菜单项显隐状态
  const [clickObj, setClickObj] = useState(null) // 点击的对象

  /**
   * 鼠标右键事件
   * @param event 事件对象
   */
  const handleContextMenu = event => {
    event.preventDefault()
    const { clientX, clientY, target } = event
    const clickText = target.innerText
    console.error('点击右键事件', event)
    setMenuPosition({ x: clientX - 60, y: 15 })
    // setMenuPosition({ x: target.offsetLeft, y: 10 });
    setShowContextMenu(true)
    setClickObj(event)
  }

  /**
   * 点击菜单项
   */
  const onClickMenuItem = () => {
    setShowContextMenu(false)
  }
  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        position: 'relative',
      }}
    >
      {props.label}
      {isShowContextMenu && <ContextMenu clickData={clickObj} menuItems={props.menuItems} onClickFn={onClickMenuItem} menuPosition={menuPosition} />}
    </div>
  )
}

export default ContextMenuComponent
