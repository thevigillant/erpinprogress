const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedFiscal() {
  console.log("🏛️  Seeding dados fiscais...");

  // ── Regras Tributárias ──
  const taxRules = [
    { name: "ICMS SP Interno", type: "ICMS", rate: 18.0, cst: "00", cfop: "5102", ufOrigem: "SP", ufDestino: "SP", description: "ICMS alíquota interna São Paulo para vendas" },
    { name: "ICMS SP → RJ", type: "ICMS", rate: 12.0, cst: "00", cfop: "6102", ufOrigem: "SP", ufDestino: "RJ", description: "ICMS interestadual SP para RJ" },
    { name: "ICMS SP → MG", type: "ICMS", rate: 12.0, cst: "00", cfop: "6102", ufOrigem: "SP", ufDestino: "MG", description: "ICMS interestadual SP para MG" },
    { name: "ICMS SP → Nordeste", type: "ICMS", rate: 7.0, cst: "00", cfop: "6102", ufOrigem: "SP", ufDestino: "BA", description: "ICMS interestadual SP para regiões N/NE/CO" },
    { name: "PIS Cumulativo", type: "PIS", rate: 0.65, cst: "01", cfop: "", description: "PIS regime cumulativo (Lucro Presumido)" },
    { name: "PIS Não-Cumulativo", type: "PIS", rate: 1.65, cst: "01", cfop: "", description: "PIS regime não-cumulativo (Lucro Real)" },
    { name: "COFINS Cumulativo", type: "COFINS", rate: 3.0, cst: "01", cfop: "", description: "COFINS regime cumulativo (Lucro Presumido)" },
    { name: "COFINS Não-Cumulativo", type: "COFINS", rate: 7.6, cst: "01", cfop: "", description: "COFINS regime não-cumulativo (Lucro Real)" },
    { name: "IPI Geral 5%", type: "IPI", rate: 5.0, cst: "50", cfop: "", description: "IPI alíquota geral para produtos industrializados" },
    { name: "ISS São Paulo", type: "ISS", rate: 5.0, cst: "", cfop: "", description: "ISS município de São Paulo" },
  ];

  for (const rule of taxRules) {
    await prisma.taxRule.create({ data: rule });
  }
  console.log(`   ✅ ${taxRules.length} regras tributárias criadas`);

  // ── Notas Fiscais de exemplo ──
  const notas = [
    {
      numero: "000001",
      serie: "1",
      tipo: "NFE",
      natureza: "Venda de mercadoria",
      status: "emitida",
      chaveAcesso: "35260312345678000190550010000000011234567890",
      protocolo: "135260300001234",
      destinatario: "Tech Solutions Ltda",
      cnpjDest: "98.765.432/0001-10",
      valorTotal: 15750.00,
      valorProdutos: 15000.00,
      valorIcms: 2700.00,
      valorPis: 247.50,
      valorCofins: 1140.00,
      valorDesconto: 0,
      valorFrete: 750.00,
      dataEmissao: new Date("2026-03-15T10:30:00"),
      dataSaida: new Date("2026-03-15T14:00:00"),
    },
    {
      numero: "000002",
      serie: "1",
      tipo: "NFE",
      natureza: "Venda de mercadoria",
      status: "emitida",
      chaveAcesso: "35260312345678000190550010000000021234567891",
      protocolo: "135260300001235",
      destinatario: "Distribuidora ABC S.A.",
      cnpjDest: "11.222.333/0001-44",
      valorTotal: 42300.00,
      valorProdutos: 40000.00,
      valorIcms: 7200.00,
      valorPis: 660.00,
      valorCofins: 3040.00,
      valorDesconto: 1500.00,
      valorFrete: 1800.00,
      dataEmissao: new Date("2026-03-14T09:15:00"),
      dataSaida: new Date("2026-03-14T16:30:00"),
    },
    {
      numero: "000003",
      serie: "1",
      tipo: "NFCE",
      natureza: "Venda ao consumidor final",
      status: "emitida",
      chaveAcesso: "35260312345678000190650010000000031234567892",
      protocolo: "135260300001236",
      destinatario: "Consumidor Final",
      cnpjDest: "123.456.789-00",
      valorTotal: 459.90,
      valorProdutos: 459.90,
      valorIcms: 82.78,
      valorPis: 2.99,
      valorCofins: 13.80,
      valorDesconto: 0,
      valorFrete: 0,
      dataEmissao: new Date("2026-03-16T11:45:00"),
    },
    {
      numero: "000004",
      serie: "1",
      tipo: "NFE",
      natureza: "Devolução de mercadoria",
      status: "cancelada",
      chaveAcesso: "35260312345678000190550010000000041234567893",
      protocolo: "135260300001237",
      destinatario: "Fornecedor Industrial ME",
      cnpjDest: "55.666.777/0001-22",
      valorTotal: 8900.00,
      valorProdutos: 8500.00,
      valorIcms: 1530.00,
      valorPis: 140.25,
      valorCofins: 646.00,
      valorDesconto: 0,
      valorFrete: 400.00,
      dataEmissao: new Date("2026-03-10T08:00:00"),
    },
    {
      numero: "000005",
      serie: "1",
      tipo: "NFE",
      natureza: "Venda de mercadoria",
      status: "rascunho",
      destinatario: "Comércio Popular S.A.",
      cnpjDest: "33.444.555/0001-88",
      valorTotal: 23500.00,
      valorProdutos: 22000.00,
      valorIcms: 3960.00,
      valorPis: 363.00,
      valorCofins: 1672.00,
      valorDesconto: 500.00,
      valorFrete: 2000.00,
    },
    {
      numero: "000006",
      serie: "1",
      tipo: "NFCE",
      natureza: "Venda ao consumidor final",
      status: "emitida",
      chaveAcesso: "35260312345678000190650010000000061234567895",
      protocolo: "135260300001239",
      destinatario: "Consumidor Final",
      cnpjDest: "987.654.321-00",
      valorTotal: 1289.00,
      valorProdutos: 1289.00,
      valorIcms: 232.02,
      valorPis: 8.38,
      valorCofins: 38.67,
      valorDesconto: 0,
      valorFrete: 0,
      dataEmissao: new Date("2026-03-16T14:20:00"),
    },
  ];

  for (const nf of notas) {
    const created = await prisma.notaFiscal.create({ data: nf });
    // Criar XML simulado para notas emitidas
    if (nf.status === "emitida") {
      await prisma.xmlStorage.create({
        data: {
          notaFiscalId: created.id,
          tipo: "autorizacao",
          xmlContent: `<?xml version="1.0"?><nfeProc><NFe><infNFe><ide><nNF>${nf.numero}</nNF></ide></infNFe></NFe><protNFe><infProt><nProt>${nf.protocolo}</nProt><cStat>100</cStat></infProt></protNFe></nfeProc>`,
          fileName: `${nf.numero}-nfe.xml`,
          fileSize: 4096,
        },
      });
    }
    if (nf.status === "cancelada") {
      await prisma.xmlStorage.create({
        data: {
          notaFiscalId: created.id,
          tipo: "cancelamento",
          xmlContent: `<?xml version="1.0"?><procEventoNFe><evento><infEvento><tpEvento>110111</tpEvento></infEvento></evento></procEventoNFe>`,
          fileName: `${nf.numero}-cancel.xml`,
          fileSize: 2048,
        },
      });
    }
  }
  console.log(`   ✅ ${notas.length} notas fiscais criadas com XMLs`);

  // ── Exportações contábeis ──
  const exports = [
    { periodo: "2026-01", tipo: "SPED", status: "exportado", fileName: "SPED_2026_01.txt", totalNotas: 245, valorTotal: 1842500.00, exportedBy: "Bruno Reis" },
    { periodo: "2026-02", tipo: "SPED", status: "exportado", fileName: "SPED_2026_02.txt", totalNotas: 312, valorTotal: 2156300.00, exportedBy: "Bruno Reis" },
    { periodo: "2026-03", tipo: "SPED", status: "pendente", fileName: "", totalNotas: 0, valorTotal: 0, exportedBy: "" },
    { periodo: "2026-01", tipo: "EFD", status: "exportado", fileName: "EFD_2026_01.txt", totalNotas: 245, valorTotal: 1842500.00, exportedBy: "Maria Oliveira" },
    { periodo: "2026-02", tipo: "EFD", status: "gerado", fileName: "EFD_2026_02.txt", totalNotas: 312, valorTotal: 2156300.00, exportedBy: "Maria Oliveira" },
    { periodo: "2026-01", tipo: "SINTEGRA", status: "exportado", fileName: "SINTEGRA_2026_01.txt", totalNotas: 245, valorTotal: 1842500.00, exportedBy: "Bruno Reis" },
  ];

  for (const exp of exports) {
    await prisma.accountingExport.create({ data: exp });
  }
  console.log(`   ✅ ${exports.length} exportações contábeis criadas`);

  console.log("🏛️  Seed fiscal concluído!");
}

seedFiscal()
  .catch((e) => {
    console.error("❌ Erro no seed fiscal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
