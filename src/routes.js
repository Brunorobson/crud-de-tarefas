import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils.js/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: async (req, res) => {
          const tasks = await database.select('tasks', req.query)
      
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
          return res.end(JSON.stringify(tasks))
        }
      },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
        const { title, description } = req.body
        const now = new Date().toISOString()
      
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: '',
          created_at: now,
          updated_at: now,
        }
      
        await database.insert('tasks', task)
      
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
        return res.end(JSON.stringify(task))
      },
  },

  
]