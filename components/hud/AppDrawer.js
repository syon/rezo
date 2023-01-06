import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MenuIcon from './MenuIcon'
import { rd } from '../../store/rootSlice'

export default function AppDrawer(props) {
  const active = useSelector((state) => state.rezo.drawer.app)
  const dispatch = useDispatch()

  return (
    <>
      <div className="AppDrawerBtn">
        <label
          className="btn btn-ghost btn-sm text-violet-500"
          onClick={(e) => dispatch(rd.openAppDrawer())}
        >
          <MenuIcon />
        </label>
      </div>
      <div className={`AppDrawer ${active ? 'active' : ''}`}>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </>
  )
}
