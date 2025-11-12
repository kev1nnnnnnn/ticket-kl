import axios from 'axios'

export async function emitNewComment(comment: any) {
  try {
    await axios.post('http://localhost:4000/emit/comment', comment)
    console.log('Comentário enviado ao servidor WS:', comment)
  } catch (error) {
    console.error('Erro ao emitir comentário via WS:', error.message)
  }
}
