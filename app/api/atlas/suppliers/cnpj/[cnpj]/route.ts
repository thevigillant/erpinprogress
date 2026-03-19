import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { cnpj: string } }
) {
  const cnpj = (await params).cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14) {
    return NextResponse.json({ detail: "CNPJ inválido" }, { status: 400 });
  }

  try {
    // Tenta BrasilAPI com User-Agent apropriado (alguns servidores bloqueiam requests sem UA)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: {
        "User-Agent": "AtlasEnterprise/2.0 (gestao-cadastros)",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`BrasilAPI retornou ${response.status}:`, errorData);
      
      if (response.status === 404) {
        return NextResponse.json({ detail: "CNPJ não encontrado na Receita Federal." }, { status: 404 });
      }
      if (response.status === 429) {
        return NextResponse.json({ detail: "Muitas consultas em pouco tempo. Aguarde e tente novamente." }, { status: 429 });
      }
      
      throw new Error(`Erro na BrasilAPI: ${response.status}`);
    }

    const data = await response.json();

    // Normaliza a atividade principal (lógica do Atlas original)
    let atividade_principal = data.cnae_fiscal_descricao || "";
    if (!atividade_principal && data.atividade_principal && Array.isArray(data.atividade_principal) && data.atividade_principal.length > 0) {
      const ap = data.atividade_principal[0];
      atividade_principal = `${ap.code || ""} - ${ap.text || ""}`;
    }

    // Mapeia para o formato que o componente Atlas espera, com fallbacks
    return NextResponse.json({
      cnpj: data.cnpj || cnpj,
      razao_social: data.razao_social || "",
      nome_fantasia: data.nome_fantasia || data.razao_social || "",
      situacao: data.descricao_situacao_cadastral || data.situacao || "",
      logradouro: data.logradouro || "",
      numero: data.numero || "",
      complemento: data.complemento || "",
      bairro: data.bairro || "",
      municipio: data.municipio || "",
      uf: data.uf || "",
      cep: data.cep || "",
      telefone: data.ddd_telefone_1 || data.telefone || "",
      email: data.email || "",
      porte: data.descricao_porte || data.porte || "",
      natureza_juridica: data.descricao_natureza_juridica || data.natureza_juridica || "",
      atividade_principal: atividade_principal,
      data_abertura: data.data_inicio_atividade || data.abertura || "",
      capital_social: data.capital_social?.toString() || "0",
    });
  } catch (error: any) {
    console.error("Erro ao buscar CNPJ:", error);
    return NextResponse.json(
      { detail: error.message === "fetch failed" ? "Erro de conexão com o servidor de consulta." : "Não foi possível consultar o CNPJ. Tente novamente mais tarde." },
      { status: 502 }
    );
  }
}
