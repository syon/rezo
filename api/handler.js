const express = require('express')
const Quest = require('./lib/Quest')

const app = express()
app.use(express.json())

app.get('/panels/:panelId', (req, res) => {
  const { panelId } = req.params
  const data = Quest.loadComputed(panelId)
  res.json(data)
})

app.post('/panels/:panelId/quests', (req, res) => {
  const { panelId } = req.params
  const addedItem = Quest.add(panelId, req.body)
  res.json(addedItem)
})

app.patch('/panels/:panelId/quests/:questId/title', (req, res) => {
  const { panelId, questId } = req.params
  const { title } = req.body
  const data = { title }
  Quest.updateTitle(panelId, questId, data)
  res.status(200).send('OK')
})

app.post('/panels/:panelId/quests/:questId/position', (req, res) => {
  const { panelId, questId } = req.params
  const { x, y } = req.body
  const data = { x, y }
  Quest.updatePosition(panelId, questId, data)
  res.status(200).send('OK')
})

app.post('/panels/:panelId/quests/:questId/sockets', (req, res) => {
  const { panelId, questId } = req.params
  const { id: socketId, type } = req.body
  const data = { questId, socketId, type }
  Quest.addSocket(panelId, data)
  res.status(200).send('OK')
})

app.post('/panels/:panelId/quests/:questId/sockets/:socketId', (req, res) => {
  const { panelId, questId, socketId } = req.params
  const { title } = req.body
  const data = { questId, socketId, title }
  Quest.updateSocket(panelId, data)
  res.status(200).send('OK')
})

app.delete(
  '/panels/:panelId/quests/:questId/sockets/index/:socketIndex',
  (req, res) => {
    const { panelId, questId, socketIndex: idxStr } = req.params
    const data = { questId, socketIndex: Number(idxStr) }
    Quest.detachSocket(panelId, data)
    res.status(200).send('OK')
  }
)

app.post('/panels/:panelId/facts/:questId', (req, res) => {
  const { panelId, questId } = req.params
  const { done } = req.body
  Quest.addFact(panelId, questId, { done })
  res.status(200).send('OK')
})

module.exports = app
