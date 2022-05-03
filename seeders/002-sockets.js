const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const dataset = fs.readFileSync(path.join(__dirname, 'dataset', 'sockets.tsv'), 'utf-8')

const rawRecords = parse(dataset, {
  columns: true,
  delimiter: '\t',
  skip_empty_lines: true,
  trim: true,
})

const records = rawRecords.map((x) => {
  x.createdAt = new Date()
  x.updatedAt = new Date()
  return x
})

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Sockets', records, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sockets', null, {})
  },
}
