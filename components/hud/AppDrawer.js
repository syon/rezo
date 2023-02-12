import { useSelector, useDispatch } from 'react-redux'
import MenuIcon from './MenuIcon'
import UploadIcon from './UploadIcon'
import DownloadIcon from './DownloadIcon'
import DeleteIcon from './DeleteIcon'
import PhotoIcon from './PhotoIcon'
import FolderIcon from './FolderIcon'
import { sl, rd } from '../../store/rootSlice'
import { getStageNode } from '../Stage'

export default function AppDrawer(props) {
  const { app: active } = useSelector((s) => s.rezo.drawer)
  const root = useSelector(sl.gRoot)
  const dispatch = useDispatch()

  const handleSave = () => {
    dispatch(rd.fileDownload())
  }

  const handlePNG = () => {
    const stage = getStageNode()
    const url = stage.toDataURL({ pixelRatio: 2 })
    dispatch(rd.downloadAsPNG(url))
  }

  const handleDelete = () => {
    dispatch(rd.deleteSaveData())
  }

  return (
    <>
      <div className="TopLeftArea">
        <div className="flex items-center">
          <label
            className="btn btn-ghost btn-sm rounded-none text-slate-400"
            onClick={(e) => dispatch(rd.openAppDrawer())}
          >
            <MenuIcon />
          </label>
          <div className="ml-3 text-slate-400">{root.def.head.title}</div>
        </div>
      </div>
      <div className={`AppDrawer ${active ? 'active' : ''}`}>
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-400">Rezo</h1>
            </div>
            <ul className="menu bg-base-100 w-44 p-2 rounded-box">
              <li>
                <a onClick={handleSave}>
                  <DownloadIcon /> Export
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
              <label htmlFor="modal-MemoryDialog">
                <FolderIcon /> Save data
              </label>
            </li>
          </ul>

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
