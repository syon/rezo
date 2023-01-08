import Rezo from '../../lib/Rezo'

export default function MemoryDialog(props) {
  const memories = Rezo.getMemoriesSummary()

  const memoryElems = memories.map((m) => {
    return (
      <tr key={m.id}>
        <td>{m.head.title}</td>
        <td>{m.meta.lastUpdate}</td>
      </tr>
    )
  })

  return (
    <div className="MemoryDialog">
      <input type="checkbox" id="modal-MemoryDialog" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <h3 className="font-bold text-lg">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            Youve been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>{memoryElems}</tbody>
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
