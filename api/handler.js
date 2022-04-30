const fs = require('fs')
const bodyParser = require('body-parser')
const app = require('express')()
const CalcQuest = require('../operation/CalcQuest')

app.use(bodyParser.json())

app.get('/refresh', (req, res) => {
  CalcQuest()
  res.json({ data: 'data' })
})

app.post('/quests/:id/sockets', (req, res) => {
  console.log('POST start')
  const questId = req.params.id
  const { id, type } = req.body

  const defJson = fs.readFileSync('./db/QuestDef.json', 'utf-8')
  const def = JSON.parse(defJson)
  const target = def[questId]
  if (questId === id) {
    throw new Error(`Socket ID: [${id}] itself.`)
  }
  const exists = target.sockets.some((x) => x.id === id)
  if (exists) {
    throw new Error(`Socket ID: [${id}] Already exists.`)
  }
  target.sockets.push({ id, type })
  const outJson = JSON.stringify(def, null, 2)
  fs.writeFileSync('./db/QuestDef.json', outJson)
  console.log('////////////// CalcQuest bef')
  CalcQuest()
  console.log('////////////// CalcQuest after')
  res.status(200).send('OK')
})

module.exports = app
