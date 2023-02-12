import Rezo from '../lib/Rezo'

export default function Rescue(props) {
  const savedataKeys = Object.keys(window.localStorage)
  savedataKeys.sort((a, b) => {
    return a.localeCompare(b)
  })
  const savedataElems = savedataKeys
    .filter((key) => key.startsWith('savedata-'))
    .map((key) => {
      const data = window.localStorage[key]
      const handleSave = () => {
        Rezo.downloadAsJson(`rezo-${key}.json`, data)
      }
      return (
        <div key={key} className="mb-8">
          <div className="flex justify-between">
            <h4 className="font-bold">{key}</h4>
            <button className="btn btn-xs" onClick={handleSave}>
              save as json
            </button>
          </div>
          <textarea className="w-full h-24 p-2 font-mono text-xs">
            {data}
          </textarea>
        </div>
      )
    })

  const handleResetAll = () => {
    if (window.confirm('Are you sure?')) {
      window.localStorage.clear()
      window.navigation.reload()
    }
  }

  return (
    <div>
      <div>{savedataElems}</div>
      <div>
        <button className="btn btn-error btn-sm" onClick={handleResetAll}>
          Reset All
        </button>
      </div>
    </div>
  )
}
