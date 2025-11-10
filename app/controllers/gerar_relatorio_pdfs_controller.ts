import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import PDFDocument from 'pdfkit'
import Contrato from '../models/contrato.js'
import Client from '#models/cliente'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function gerarPdfContrato(contrato: Contrato, cliente: Client): Promise<string> {
  const uploadsDir = path.resolve(__dirname, '../../uploads/contratos')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const pdfFileName = `contrato_${contrato.numeroContrato}.pdf`
  const pdfPath = path.join(uploadsDir, pdfFileName)

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const writeStream = fs.createWriteStream(pdfPath)
  doc.pipe(writeStream)

  // Dados da empresa (estáticos)
  const empresa = {
    razaoSocial: 'KSOFT SOLUTIONS',
    endereco: 'Av. Constantino Nery, nº 1234, São Geraldo',
    cidade: 'Manaus',
    estado: 'AM',
    cnpj: '98.765.432/0001-10',
    representante: 'John Kevin C. de Oliveira',
    telefone: '(92) 99608-0250',
    email: 'john.ksoftsolutuions@gmail.com'
  }

  // Logo da empresa
  const logoPath = path.resolve(__dirname, '../../public/images/logo.jpg')
  if (fs.existsSync(logoPath)) doc.image(logoPath, 450, 25, { width: 40 })

  // Cabeçalho
  doc.fontSize(14).font('Times-Bold').text(empresa.razaoSocial, 50, 35)
  doc.fontSize(9).font('Times-Roman')
    .text(`${empresa.endereco} - ${empresa.cidade}/${empresa.estado}`, 50, 55)
    .text('CNPJ: ' + empresa.cnpj, 50, 68)
    .text(`Tel: ${empresa.telefone} | ${empresa.email}`, 50, 80)

  doc.moveTo(50, 100).lineTo(550, 100).lineWidth(0.5).strokeColor('#cccccc').stroke()
  doc.fontSize(16).font('Times-Bold').fillColor('black')
    .text('CONTRATO DE ABERTURA KSOFT SOLUTIONS', 50, 115, { align: 'center' })
    .moveDown(2)

  // Dados do cliente
  const startY = doc.y
  doc.fontSize(11).font('Times-Bold').text('DADOS DO CLIENTE', 50, startY)

  doc.font('Times-Bold').fontSize(11).text('Nº do Contrato:', 370, startY + 18)
  doc.font('Times-Roman').fontSize(11).text(contrato.numeroContrato, 455, startY + 18)

  const valorContrato = `R$ ${contrato.valorTotal.toFixed(2)}`
  doc.font('Times-Bold').fontSize(11).text('Valor do Contrato:', 368, startY + 35)
  doc.font('Times-Roman').fontSize(11).text(valorContrato, 465, startY + 35)

  doc.fontSize(10).font('Times-Roman')
    .text('Nome: ' + cliente.nome, 50, startY + 18)
    .text('Email: ' + (cliente.email || '-'), 50, startY + 33)
    .text('Telefone: ' + (cliente.telefone || '-'), 50, startY + 48)

  // Endereços do cliente
  if (cliente.enderecos && cliente.enderecos.length > 0) {
    cliente.enderecos.forEach((endereco: any, i: number) => {
      doc.text(`Endereço ${i + 1}: ${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}, CEP: ${endereco.cep}`, 50, startY + 63 + i * 15)
    })
  }

  doc.y += 10
  doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).strokeColor('#e6e6e6').stroke()
  doc.moveDown(2)

  // Texto e cláusulas do contrato
  doc.fontSize(11).font('Times-Roman').fillColor('black')
    .text(`Pelo presente instrumento particular de Contrato para Desenvolvimento de Sistema de Informática...`, { align: 'justify', lineGap: 4 })
    .moveDown(0.8)

  const clausulas = [
    '1. Objeto: Prestação de serviços de acordo com o escopo definido entre as partes.',
    '2. Prazo: O presente contrato terá início na data acordada e término conforme especificado.',
    '3. Obrigações do Prestador: Executar os serviços com diligência e competência.',
    '4. Obrigações do Cliente: Fornecer informações e suporte necessários.',
    '5. Valor e Pagamento: O valor total é o descrito neste contrato, a ser pago conforme condições acordadas.',
    '6. Rescisão: O contrato poderá ser rescindido mediante aviso prévio de 30 dias.',
    '7. Confidencialidade: As partes comprometem-se a manter sigilo sobre informações obtidas durante a vigência do contrato.',
  ]

  clausulas.forEach(c => doc.font('Times-Bold').text(c, { align: 'justify', lineGap: 4 }).moveDown(0.4))

  // Assinaturas
  const sigY = doc.y + 20
  doc.font('Times-Bold').fontSize(12).fillColor('#004080').text('Assinaturas', 50, sigY)
  const assinaturaY = sigY + 25
  doc.font('Times-Roman').fontSize(10).fillColor('#000')
  doc.text('Responsável pelo Cliente:', 50, assinaturaY)
  doc.text('__________________________________', 50, assinaturaY + 15)
  doc.text(cliente.nome, 50, assinaturaY + 30)

  doc.text('Representante da Empresa:', 300, assinaturaY)
  doc.text('__________________________________', 300, assinaturaY + 15)
  doc.text(empresa.representante, 300, assinaturaY + 30)

  // Rodapé
  const bottom = 780
  doc.strokeColor('#004080').lineWidth(1).moveTo(50, bottom).lineTo(550, bottom).stroke()
  doc.fontSize(9).fillColor('gray').text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 50, bottom + 5, { align: 'right' })

  doc.end()

  await new Promise<void>((resolve, reject) => {
    writeStream.on('finish', resolve)
    writeStream.on('error', reject)
  })

  return pdfPath
}
