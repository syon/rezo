import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Rezo from '../../lib/Rezo'
import { rd } from '../../store/rootSlice'
import FolderIcon from './FolderIcon'
import UploadIcon from './UploadIcon'
import DeleteIcon from './DeleteIcon'
import Btn from '../Btn'

export default function MemoryDialog(props) {
  const activeMemoryId = Rezo.getActiveMemoryId()
  const lastUpdate = useSelector((s) => s.rezo.memory.lastUpdate)
  const [memories, setMemories] = useState(Rezo.getMemoriesSummary())
  const dispatch = useDispatch()

  useEffect(() => {
    setMemories(Rezo.getMemoriesSummary())
  }, [lastUpdate])

  const memoryElems = memories.map((m) => {
    const active = m.id === activeMemoryId
    const handleLoad = () => {
      dispatch(rd.loadFromMemory(m.id))
    }
    const handleDelete = () => {
      dispatch(rd.removeFromMemory(m.id))
      setMemories(Rezo.getMemoriesSummary())
    }

    return (
      <tr key={m.id} className={active ? 'active' : undefined}>
        <td>{active && '▶️'}</td>
        <td>{m.head.title}</td>
        <td>{m.meta.lastUpdateLabel}</td>
        <td>
          {!active && (
            <Btn ghost size="sm" onClick={handleLoad}>
              <UploadIcon />
            </Btn>
          )}
        </td>
        <td className="text-red-700">
          {!active && (
            <Btn ghost size="sm" onClick={handleDelete}>
              <DeleteIcon />
            </Btn>
          )}
        </td>
      </tr>
    )
  })

  const handleNew = () => {
    dispatch(rd.createNewSaveData())
  }

  const handleImport = () => {
    dispatch(rd.openStageDropzone())
  }

  const handleOutside = () => {
    
  }

  return (
    <div className="MemoryDialog">
      <input type="checkbox" id="modal-MemoryDialog" className="modal-toggle" />
      <div className="modal" onClick={handleOutside}>
        <div className="modal-box w-11/12 max-w-4xl">
          <h3 className="flex justify-between items-center font-bold text-lg">
            <div className="flex items-center">
              <FolderIcon />
              <span className="ml-2">Save data</span>
            </div>
            <div className="flex gap-4 items-center">
              <Btn size="sm" outline primary onClick={handleNew}>
                Create new data
              </Btn>
              <Btn size="sm" outline primary onClick={handleImport}>
                Import
              </Btn>
              <label
                htmlFor="modal-MemoryDialog"
                className="btn btn-ghost btn-xs"
              >
                ✕
              </label>
            </div>
          </h3>

          <div className="overflow-x-auto mt-8">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Last Update</th>
                  <th>Load</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{memoryElems}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
