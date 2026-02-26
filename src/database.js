import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'

const csvFilePath = new URL('../data.csv', import.meta.url)

export class Database {
  #ready = false

  async #init() {
    if (this.#ready) return

    try {
      await fs.access(csvFilePath)
    } catch {
      await fs.writeFile(
        csvFilePath,
        'id,title,description,completed_at,created_at,updated_at\n',
        'utf-8'
      )
    }

    this.#ready = true
  }

  #csvEscape(value) {
    if (value === null || value === undefined) return ''
    const s = String(value)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  async insertTask(task) {
    await this.#init()

    const line =
      [
        this.#csvEscape(task.id),
        this.#csvEscape(task.title),
        this.#csvEscape(task.description),
        this.#csvEscape(task.completed_at),
        this.#csvEscape(task.created_at),
        this.#csvEscape(task.updated_at),
      ].join(',') + '\n'

    await fs.appendFile(csvFilePath, line, 'utf-8')
    return task
  }

  async getAllTasks() {
    await this.#init()
  
    const stream = createReadStream(csvFilePath)
  
    const parser = stream.pipe(
      parse({
        columns: true,          // usa a primeira linha como header
        trim: true,
        skip_empty_lines: true,
      })
    )
  
    const tasks = []
    for await (const record of parser) {
      tasks.push(record)
    }
  
    return tasks
  }
}