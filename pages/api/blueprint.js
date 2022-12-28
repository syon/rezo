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
  const { boxes, binds, fact } = convertForDraw(objD, objF)
  res.status(200).json({ boxes, binds, fact })
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

function judgeCompleted(def, factTitles, nodeKey) {
  const nodePieces = def.structure[nodeKey]?.pieces
  const nodeTitle = def.master[nodeKey]?.title
  if (!nodePieces) {
    const judgeByNodeTitle = factTitles.includes(nodeTitle)
    if (judgeByNodeTitle) {
      factTitles.push(nodeTitle)
    }
    return judgeByNodeTitle
  }
  const completedList = Object.entries(nodePieces).map(([pk, pv]) => {
    const pTitle = def.master[pk]?.title
    const hasPieces = def.structure[pk]?.pieces?.length > 0
    if (hasPieces) {
      return judgeCompleted(def, factTitles, pk)
    }
    return factTitles.includes(pTitle)
  })
  const isCompleted = completedList.every(Boolean)
  if (isCompleted) {
    factTitles.push(nodeTitle)
  }
  return isCompleted
}

function convertForDraw(def, fact) {
  if (!def || !def.structure) return null

  const boxes = Object.fromEntries(
    Object.entries(def.structure).map(([nk, nv]) => {
      nv.title = def.master[nk]?.title
      nv.completed = judgeCompleted(def, fact.titles, nk)
      nv.pieces = Object.fromEntries(
        Object.entries(nv.pieces || {}).map(([pk, pv]) => {
          pv.title = def.master[pk]?.title
          pv.completed = judgeCompleted(def, fact.titles, pk)
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
