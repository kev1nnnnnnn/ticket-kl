/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| Aqui você define as rotas da sua API.
| Exemplo: login e rota protegida para testar autenticação.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import CategoriaController from '#controllers/categorias_controller'
import ChamadosController from '#controllers/chamados_controller'
import ComentarioChamadoController from '#controllers/comentarios_chamados_controller'
// import Chamados from '#controllers/chamados'

// Rota padrão (teste)
router.get('/', async () => {
  return { hello: 'world' }
})
// 🔒 Rota protegida — só acessa com token válido
router.get('/me', [AuthController, 'me'])

// 🔐 Rota de login
router.post('/login', [AuthController, 'login'])
router.resource('categorias', CategoriaController)
router.resource('chamados', ChamadosController)
router.resource('comentarios-chamados', ComentarioChamadoController)

// Rotas de comentários hierárquicas
// POST http://localhost:3333/chamados/2/comentarios
router.group(() => {
  // Listar todos os comentários de um chamado
  router.get('/', [ComentarioChamadoController, 'index'])
  
  // Criar comentário para um chamado
  router.post('/', [ComentarioChamadoController, 'store'])
}).prefix('/chamados/:chamadoId/comentarios')


