import fs from 'fs'
const pathToData = './pages/api/data.json'

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
  const data = JSON.parse(buf)
  const draw = convertForDraw(data)
  res.status(200).json(draw)
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

function convertForDraw(data) {
  if (!data || !data.structure) return null
  const boxes = Object.fromEntries(
    Object.entries(data.structure).map(([nk, nv]) => {
      nv.title = data.master[nk]?.title
      nv.pieces = Object.fromEntries(
        Object.entries(nv.pieces || {}).map(([pk, pv]) => {
          pv.title = data.master[pk]?.title
          return [pk, pv]
        })
      )
      return [nk, nv]
    })
  )
  const binds = Object.entries(data.structure)
    .map(([nk, nv]) => {
      if (!nv.pieces) return null
      return Object.keys(nv.pieces).map((pk) => {
        return { from: pk, to: nk }
      })
    })
    .flat()
  return { boxes, binds }
}
