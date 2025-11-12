import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

async function startServer() {
  try {
    const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER })

    // Retorna o servidor HTTP já iniciado pelo Adonis
    await ignitor
      .tap((app) =>
        app.booting(async () => {
          await import('#start/env')
        })
      )
      .httpServer()
      .start()

    console.log('✅ Servidor HTTP iniciado com sucesso!')

  } catch (error) {
    process.exitCode = 1
    prettyPrintError(error)
  }
}

startServer()
