import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { initSocket } from '../start/socket.js'
import type { Server as HttpServer } from 'http'

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
    const httpServer = (await ignitor
      .tap((app) =>
        app.booting(async () => {
          await import('#start/env')
          return
        })
      )
      .httpServer()
      .start()) as unknown as HttpServer

    console.log('✅ Servidor HTTP iniciado com sucesso!')

    // 🔌 Inicializa Socket.IO
    initSocket(httpServer)

    console.log('⚡ Socket.IO pronto para conexões!')

  } catch (error) {
    process.exitCode = 1
    prettyPrintError(error)
  }
}

startServer()
