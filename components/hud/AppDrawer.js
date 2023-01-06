import { useSelector, useDispatch } from 'react-redux'
import MenuIcon from './MenuIcon'
import UploadIcon from './UploadIcon'
import DownloadIcon from './DownloadIcon'
import { rd } from '../../store/rootSlice'

export default function AppDrawer(props) {
  const active = useSelector((state) => state.rezo.drawer.app)
  const dispatch = useDispatch()

  const handleLoad = () => {
    dispatch(rd.openStageDropzone())
  }

  const handleSave = () => {
    dispatch(rd.fileDownload())
  }

  const handleReset = () => {
    dispatch(rd.resetSaveData())
  }

  return (
    <>
      <div className="AppDrawerBtn">
        <label
          className="btn btn-ghost btn-sm rounded-none text-slate-400"
          onClick={(e) => dispatch(rd.openAppDrawer())}
        >
          <MenuIcon />
        </label>
      </div>
      <div className={`AppDrawer ${active ? 'active' : ''}`}>
        <ul className="menu bg-base-100 w-44 p-2 rounded-box">
          <li>
            <a onClick={handleLoad}>
              <UploadIcon /> Load
            </a>
          </li>
          <li>
            <a onClick={handleSave}>
              <DownloadIcon /> Save
            </a>
          </li>
          <li>
            <a onClick={handleReset}>
              <DownloadIcon /> Reset
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
