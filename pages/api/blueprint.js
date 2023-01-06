import fs from 'fs'
const pathToDefData = './pages/api/defData.json'
const pathToFactData = './pages/api/factData.json'

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
  const bufD = fs.readFileSync(pathToDefData, 'utf-8')
  const objD = JSON.parse(bufD)
  const bufF = fs.readFileSync(pathToFactData, 'utf-8')
  const objF = JSON.parse(bufF)
  res.status(200).json({ def: objD, facts: objF })
}

function post(req, res) {
  const { id, x, y } = req.body
  const buf = fs.readFileSync(pathToDefData, 'utf-8')
  const data = JSON.parse(buf)
  const target = data.structure[id]
  target.pos.x = x
  target.pos.y = y
  const jsonStr = JSON.stringify(data, null, 2)
  fs.writeFileSync(pathToDefData, jsonStr)
  res.status(200).json(null)
}
