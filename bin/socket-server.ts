import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const app = express()
app.use(express.json())

const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // ou 'http://localhost:5173' se quiser restringir
    methods: ['GET', 'POST'],
  },
})

// ✅ Quando o front conectar
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id)

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id)
  })
})

// ✅ Rota para o Adonis emitir novos comentários
app.post('/emit/comment', (req, res) => {
  const comment = req.body
  console.log('Novo comentário recebido do Adonis:', comment)

  // Envia para todos os conectados
  io.emit('newComment', comment)

  res.sendStatus(200)
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`)
})
