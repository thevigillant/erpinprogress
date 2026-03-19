import { NextResponse } from "next/server";

const COSMOS_TOKEN = process.env.COSMOS_TOKEN || "J91DxRi5Yq3_18tY15MO6g";

// Mapeamento de departamento por palavras-chave (replicado do Atlas)
const HARD_RULES: Record<string, [string, string]> = {
  "COCA": ["BEBIDAS", "REFRIGERANTES"],
  "REFRIGERANTE": ["BEBIDAS", "REFRIGERANTES"],
  "REFRI": ["BEBIDAS", "REFRIGERANTES"],
  "ALCOOL": ["LIMPEZA", "PRODUTOS DE LIMPEZA"],
  "LIMPEZA": ["LIMPEZA", "PRODUTOS DE LIMPEZA"],
  "SABO": ["LIMPEZA", "HIGIENE"],
  "DETERGENTE": ["LIMPEZA", "PRODUTOS DE LIMPEZA"],
  "ARROZ": ["MERCEARIA", "ALIMENTOS"],
  "FEIJAO": ["MERCEARIA", "ALIMENTOS"],
  "OLEO": ["MERCEARIA", "MATINAIS"],
  "CERVEJA": ["BEBIDAS", "ALCOOLICAS"],
  "VINHO": ["BEBIDAS", "ALCOOLICAS"],
  "SHAMPOO": ["PERFUMARIA", "HIGIENE PESSOAL"],
  "SABONETE": ["PERFUMARIA", "HIGIENE PESSOAL"],
  "AGUA": ["BEBIDAS", "AGUAS"],
  "LEITE": ["MERCEARIA", "MATINAIS"],
};

function classifyProduct(description: string): { department: string; section: string } {
  const normalized = description.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, [dept, sec]] of Object.entries(HARD_RULES)) {
    if (normalized.includes(key)) return { department: dept, section: sec };
  }
  return { department: "DIVERSOS", section: "OUTROS" };
}

export async function GET(
  _request: Request,
  { params }: { params: { gtin: string } }
) {
  const gtin = (await params).gtin.replace(/\D/g, "");

  if (!gtin || gtin.length < 8) {
    return NextResponse.json({ detail: "GTIN inválido" }, { status: 400 });
  }

  try {
    // 1. Tentar Bluesoft Cosmos (API de produtos mais completa do Brasil)
    const cosmosRes = await fetch(`https://api.cosmos.bluesoft.com.br/gtins/${gtin}.json`, {
      headers: {
        "X-Cosmos-Token": COSMOS_TOKEN,
        "Content-Type": "application/json",
        "User-Agent": "Atlas-ERP/2.0",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (cosmosRes.ok) {
      const data = await cosmosRes.json();
      const description = data.description || data.avg_price_description || `PRODUTO ${gtin}`;
      const { department, section } = classifyProduct(description);
      const thumbnail = data.thumbnail || data.gtins?.[0]?.thumbnail || null;

      return NextResponse.json({
        gtin,
        description: description.toUpperCase(),
        department,
        section,
        ncm: data.ncm?.code?.toString() || "",
        cest: data.cest?.code?.toString() || "",
        thumbnail: thumbnail || null,
        suggested_price: data.avg_price || 0,
        ai_reason: data.avg_price
          ? `Preço médio de mercado Cosmos: R$ ${Number(data.avg_price).toFixed(2)}`
          : "Produto identificado. Defina o preço manualmente.",
        source: "cosmos",
      });
    }

    // 2. Se Cosmos falhar: fallback com dados básicos
    console.warn(`Cosmos retornou ${cosmosRes.status} para GTIN ${gtin}`);

    return NextResponse.json({
      gtin,
      description: `PRODUTO ${gtin}`,
      department: "DIVERSOS",
      section: "OUTROS",
      ncm: "",
      cest: "",
      thumbnail: null,
      suggested_price: 0,
      ai_reason: "Produto não encontrado na base Cosmos. Preencha os dados manualmente.",
      source: "manual",
    });

  } catch (error: any) {
    console.error("Erro ao buscar GTIN:", error);
    return NextResponse.json(
      { detail: "Erro ao consultar o GTIN. Verifique a conexão." },
      { status: 502 }
    );
  }
}
