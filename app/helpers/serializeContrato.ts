// helpers/serializeContrato.ts
export function serializeContrato(contrato: any) {
  return {
    ...contrato.serialize(), // pega tudo normalmente
    valorTotal: Number(contrato.valorTotal), // força para number
  }
}
