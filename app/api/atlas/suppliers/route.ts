import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  try {
    const suppliers = await (prisma as any).supplier.findMany({
      where: search
        ? {
            OR: [
              { razaoSocial: { contains: search } },
              { nomeFantasia: { contains: search } },
              { cnpj: { contains: search } },
              { municipio: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    // Mapeia para o formato que o componente Atlas espera
    const mapped = suppliers.map((s: any) => ({
      id: s.id,
      cnpj: s.cnpj,
      razao_social: s.razaoSocial,
      nome_fantasia: s.nomeFantasia,
      situacao: s.situacao,
      logradouro: s.logradouro,
      numero: s.numero,
      complemento: s.complemento,
      bairro: s.bairro,
      municipio: s.municipio,
      uf: s.uf,
      cep: s.cep,
      telefone: s.telefone,
      email: s.email,
      porte: s.porte,
      natureza_juridica: s.naturezaJuridica,
      atividade_principal: s.atividadePrincipal,
      data_abertura: s.dataAbertura,
      capital_social: s.capitalSocial,
      obs: s.observacoes,
      category: s.category,
      registered_at: s.createdAt,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Erro ao listar fornecedores:", error);
    return NextResponse.json({ detail: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const supplier = await (prisma as any).supplier.upsert({
      where: { cnpj: data.cnpj },
      update: {
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        situacao: data.situacao,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep,
        telefone: data.telefone,
        email: data.email,
        porte: data.porte,
        naturezaJuridica: data.natureza_juridica,
        atividadePrincipal: data.atividade_principal,
        dataAbertura: data.data_abertura,
        capitalSocial: data.capital_social,
        observacoes: data.obs,
        category: data.category,
      },
      create: {
        cnpj: data.cnpj,
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        situacao: data.situacao,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep,
        telefone: data.telefone,
        email: data.email,
        porte: data.porte,
        naturezaJuridica: data.natureza_juridica,
        atividadePrincipal: data.atividade_principal,
        dataAbertura: data.data_abertura,
        capitalSocial: data.capital_social,
        observacoes: data.obs,
        category: data.category,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Erro ao cadastrar fornecedor:", error);
    return NextResponse.json({ detail: "Erro ao cadastrar fornecedor" }, { status: 500 });
  }
}
