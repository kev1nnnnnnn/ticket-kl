import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import CategoriaController from '#controllers/categorias_controller'
import ChamadosController from '#controllers/chamados_controller'
import ComentarioChamadoController from '#controllers/comentarios_chamados_controller'
import UsersController from '#controllers/users_controller'
import AssumesController from '#controllers/assumes_controller'

// Import do helper de middleware
import { middleware } from '#start/kernel'
import DashboardController from '#controllers/dashboard_controller'

router.get('/', async () => {
  return { hello: 'world' }
})

// 🔐 Login e usuário logado
router.post('/login', [AuthController, 'login'])
router.get('/me', [AuthController, 'me']).use(middleware.auth())

// 📦 Recursos protegidos
router.resource('categorias', CategoriaController).use('*', middleware.auth())
router.resource('chamados', ChamadosController).use('*', middleware.auth())
router.resource('comentarios-chamados', ComentarioChamadoController).use('*', middleware.auth())
router.resource('users', UsersController).use('*', middleware.auth())

router.put('/chamados/:id/resolvido', [ChamadosController, 'resolvido']).use(middleware.auth())

// Filtro de chamados
router.post('/chamados/filtrar', [ChamadosController, 'filtrar']).use(middleware.auth())

// Comentários vinculados a um chamado
router
  .group(() => {
    router.get('/', [ComentarioChamadoController, 'index'])
    router.post('/', [ComentarioChamadoController, 'store'])
  })
  .prefix('/chamados/:chamadoId/comentarios')
  .use(middleware.auth())

// 👨‍🔧 Técnico assume chamado
router.put('/chamados/:id/assumir', [AssumesController, 'assumir']).use(middleware.auth())

// 🔐 Dashboard protegido
router
  .group(() => {
    router.get('/status', [DashboardController, 'chamadosPorStatus'])
    router.get('/prioridade', [DashboardController, 'chamadosPorPrioridade'])
    router.get('/ultimos-7-dias', [DashboardController, 'chamadosUltimos7Dias'])
    router.get('/tempo-medio', [DashboardController, 'tempoMedioResolucao'])
    router.get('/resumo', [DashboardController, 'resumoGeral'])
    router.get('/todos', [DashboardController, 'index'])
  })
  .prefix('/dashboard')
  .use(middleware.auth())