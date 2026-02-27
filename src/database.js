import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'

const csvFilePath = new URL('../data.csv', import.meta.url)

const HEADERS = ['id', 'title', 'description', 'completed_at', 'created_at', 'updated_at']

export class Database {
  constructor() {
    this.#ensureCsv()
  }

  async #ensureCsv() {
    try {
      await fs.access(csvFilePath)
    } catch {
      const header = `${HEADERS.join(',')}\n`
      await fs.writeFile(csvFilePath, header, 'utf-8')
    }
  }

  #csvEscape(value) {
    if (value === null || value === undefined) return ''
    const s = String(value)
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  async #readAll() {
    await this.#ensureCsv()

    const stream = createReadStream(csvFilePath)
    const parser = stream.pipe(
      parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
      })
    )

    const rows = []
    for await (const record of parser) rows.push(record)
    return rows
  }

  async #writeAll(rows) {
    await this.#ensureCsv()

    const header = `${HEADERS.join(',')}\n`
    const body = rows
      .map((row) => HEADERS.map((h) => this.#csvEscape(row[h])).join(','))
      .join('\n')

    const content = header + (body ? body + '\n' : '')
    await fs.writeFile(csvFilePath, content, 'utf-8')
  }

  async select(table, search) {
    if (table !== 'tasks') return []

    let data = await this.#readAll()

    if (search && Object.keys(search).length > 0) {
      data = data.filter((row) =>
        Object.entries(search).some(([key, value]) => {
          if (!HEADERS.includes(key)) return false
          const cell = (row[key] ?? '').toString().toLowerCase()
          return cell.includes(String(value).toLowerCase())
        })
      )
    }

    return data
  }

  async select(table, search) {
    if (table !== 'tasks') return []
  
    let data = await this.#readAll()
  
    if (search && Object.keys(search).length > 0) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {

          if (!['title', 'description'].includes(key)) return false
  
          const cell = (row[key] ?? '').toString().toLowerCase()
          return cell.includes(String(value).toLowerCase())
        })
      })
    }
  
    return data
  }

  async update(table, id, data) {
    if (table !== 'tasks') return

    const rows = await this.#readAll()
    const idx = rows.findIndex((r) => r.id === id)

    if (idx === -1) return

    rows[idx] = { ...rows[idx], ...data, id }
    await this.#writeAll(rows)
  }

  async delete(table, id) {
    if (table !== 'tasks') return

    const rows = await this.#readAll()
    const idx = rows.findIndex((r) => r.id === id)

    if (idx === -1) return

    rows.splice(idx, 1)
    await this.#writeAll(rows)
  }
}