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
import ClientesController from '#controllers/clientes_controller'
import EnderecosController from '#controllers/enderecos_controller'
import ContratoesController from '#controllers/contratoes_controller'
import TesteEmailController from '#controllers/teste_emails_controller'
import WhatsAppController from '#controllers/whatsapps_controller'
import OrdemDeServicosController from '#controllers/ordem_de_servicos_controller'
import EmailsController from '#controllers/teste_emails_controller'

router.get('/', async () => {
  return { hello: 'world' }
})

// Login e usuário logado
router.post('/login', [AuthController, 'login'])
router.get('/me', [AuthController, 'me']).use(middleware.auth())

// Recursos protegidos
router.get('/users/filtrar', [UsersController, 'filtrar']).use(middleware.auth())
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

// Dashboard protegido
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

  // Clientes e Endereços
router
  .group(() => {
    router.get('/enderecos/cep', [EnderecosController, 'buscarCep'])
    router.get('/clientes/filtrar', [ClientesController, 'filtrar'])
    router.resource('clientes', ClientesController).apiOnly()
    router.resource('enderecos', EnderecosController).apiOnly()
  }).use(middleware.auth())



// Rotas de contratos
router
  .group(() => {
    // Listar todos os contratos (com paginação)
    router.get('/', [ContratoesController, 'index'])

    // Filtrar contratos
    router.post('/filtrar', [ContratoesController, 'filtrar'])

    // CRUD completo
    router.post('/', [ContratoesController, 'store'])
    router.get('/:id', [ContratoesController, 'show'])
    router.put('/:id', [ContratoesController, 'update'])
    router.delete('/:id', [ContratoesController, 'destroy'])
  })
  .prefix('/contratos')
  .use(middleware.auth())

 router
  .group(() => {
    router.get('/', [OrdemDeServicosController, 'index'])
    router.post('/filtrar', [OrdemDeServicosController, 'filtrar'])
    router.post('/', [OrdemDeServicosController, 'store'])
    router.get('/:id', [OrdemDeServicosController, 'show'])
    router.put('/:id', [OrdemDeServicosController, 'update'])
    router.delete('/:id', [OrdemDeServicosController, 'destroy'])
  })
  .prefix('/ordem-de-servicos') 
  .use(middleware.auth())


router
  .group(() => {
    router.post('/enviar', [EmailsController, 'enviar'])
    router.get('/logs', [EmailsController, 'index'])
    router.get('/logs/:id', [EmailsController, 'show'])
    router.delete('/logs/:id', [EmailsController, 'destroy'])
  })
  .prefix('/emails')
  .use(middleware.auth())
  
router.post('/whatsapp/send', [WhatsAppController, 'send'])