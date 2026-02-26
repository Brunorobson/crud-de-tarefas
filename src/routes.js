import { randomUUID } from "node:crypto"
import { Database } from "./database.js"

const db = new Database()

export const routes = [
    {
        method: 'POST',
        path: '/tasks',
        handler: async(req, res) => {
            const { title, description} = req.body
            
            const date = new Date().toISOString()
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at : null,
                created_at: date,
                updated_at: date
            }

            await db.insertTask(task)

        res.writeHead(201)

        return res.end(JSON.stringify(task))
    
    }
},
{
    method:'GET',
    path: '/all-tasks',
    handler: async(req, res) => {
        const tasks = await db.getAllTasks()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(tasks))
    }
}

]