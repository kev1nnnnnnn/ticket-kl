// app/Services/ContractService.ts
import Contrato from '../models/contrato.js'

export async function gerarNumeroContrato(): Promise<string> {
  const lastContrato = await Contrato.query().orderBy('id', 'desc').first()
  const nextNumero = lastContrato ? lastContrato.id + 1 : 1
  return `CTR-${nextNumero.toString().padStart(5, '0')}`
}
