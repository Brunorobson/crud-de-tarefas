// src/database.js
import fs from 'node:fs/promises'

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
    // se tiver vírgula/aspas/quebra de linha, envolve em aspas e escapa aspas duplas
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
}