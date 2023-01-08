import { useSelector, useDispatch } from 'react-redux'
import MenuIcon from './MenuIcon'
import UploadIcon from './UploadIcon'
import DownloadIcon from './DownloadIcon'
import DeleteIcon from './DeleteIcon'
import PhotoIcon from './PhotoIcon'
import { sl, rd } from '../../store/rootSlice'
import { getStageRef } from '../Stage'

export default function AppDrawer(props) {
  const { app: active } = useSelector((s) => s.rezo.drawer)
  const dispatch = useDispatch()

  const handleLoad = () => {
    dispatch(rd.openStageDropzone())
  }

  const handleSave = () => {
    dispatch(rd.fileDownload())
  }

  const handlePNG = () => {
    const stage = getStageRef()
    const url = stage.toDataURL({ pixelRatio: 2 })
    dispatch(rd.downloadAsPNG(url))
  }

  const handleDelete = () => {
    dispatch(rd.deleteSaveData())
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
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-400">Rezo</h1>
            </div>
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
                <a onClick={handlePNG}>
                  <PhotoIcon /> PNG
                </a>
              </li>
            </ul>
          </div>

          <ul className="menu bg-base-100 w-44 p-2 rounded-box">
            <li>
              <a className="text-red-700" onClick={handleDelete}>
                <DeleteIcon /> Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
