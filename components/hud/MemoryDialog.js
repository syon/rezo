import { useSelector, useDispatch } from 'react-redux'
import Rezo from '../../lib/Rezo'
import { sl, rd } from '../../store/rootSlice'
import FolderIcon from './FolderIcon'

export default function MemoryDialog(props) {
  const root = useSelector(sl.gRoot)
  const memories = Rezo.getMemoriesSummary()

  const memoryElems = memories.map((m) => {
    return (
      <tr key={m.id}>
        <td>▶</td>
        <td>{m.head.title}</td>
        <td>{m.meta.lastUpdateLabel}</td>
        <td></td>
      </tr>
    )
  })

  return (
    <div className="MemoryDialog">
      <input type="checkbox" id="modal-MemoryDialog" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <h3 className="flex items-center font-bold text-lg">
            <FolderIcon />
            <span className="ml-2">Save data</span>
          </h3>

          <div className="overflow-x-auto mt-8">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Last Update</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-slate-400">(auto)</td>
                  <td className="text-violet-500">{root.def.head.title}</td>
                  <td className="text-violet-500">
                    {Rezo.getTimestampLabel(root.def.meta.lastUpdate)}
                  </td>
                  <td className="text-slate-400"></td>
                </tr>
                {memoryElems}
              </tbody>
            </table>
          </div>

          <div className="modal-action">
            <label htmlFor="modal-MemoryDialog" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
