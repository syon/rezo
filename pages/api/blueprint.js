import fs from 'fs'
const pathToData = './pages/api/data.json'
const sampleFactData = {
  titles: ['レスポンスコード', 'CORS', 'HTML'],
}

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      get(req, res)
      break
    case 'POST':
      post(req, res)
      break
  }
}

function get(req, res) {
  const buf = fs.readFileSync(pathToData, 'utf-8')
  const def = JSON.parse(buf)
  const { boxes, binds, fact } = convertForDraw(def, sampleFactData)
  res.status(200).json({ boxes, binds, fact })
}

function post(req, res) {
  const { id, x, y } = req.body
  const buf = fs.readFileSync(pathToData, 'utf-8')
  const data = JSON.parse(buf)
  const target = data.structure[id]
  target.pos.x = x
  target.pos.y = y
  const jsonStr = JSON.stringify(data, null, 2)
  fs.writeFileSync(pathToData, jsonStr)
  res.status(200).json(null)
}

function convertForDraw(def, fact) {
  if (!def || !def.structure) return null

  const boxes = Object.fromEntries(
    Object.entries(def.structure).map(([nk, nv]) => {
      nv.title = def.master[nk]?.title
      const hasPieces = nv.pieces?.length > 0
      if (!hasPieces) {
        nv.completed = fact.titles.includes(nv.title)
      }
      nv.pieces = Object.fromEntries(
        Object.entries(nv.pieces || {}).map(([pk, pv]) => {
          pv.title = def.master[pk]?.title
          const isChildHasPieces = def.structure[pk]?.pieces?.length > 0
          if (!isChildHasPieces) {
            pv.completed = fact.titles.includes(pv.title)
          }
          return [pk, pv]
        })
      )
      return [nk, nv]
    })
  )

  const binds = Object.entries(def.structure)
    .map(([nk, nv]) => {
      if (!nv.pieces) return null
      return Object.keys(nv.pieces).map((pk) => {
        return { from: pk, to: nk }
      })
    })
    .flat()

  return { boxes, binds, fact }
}
