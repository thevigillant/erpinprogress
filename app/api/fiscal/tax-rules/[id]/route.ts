import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT — Atualiza regra tributária
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, rate, cst, cfop, ncm, ufOrigem, ufDestino, description, active } = body;

    const rule = await prisma.taxRule.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(rate !== undefined && { rate: parseFloat(rate) }),
        ...(cst !== undefined && { cst }),
        ...(cfop !== undefined && { cfop }),
        ...(ncm !== undefined && { ncm }),
        ...(ufOrigem !== undefined && { ufOrigem }),
        ...(ufDestino !== undefined && { ufDestino }),
        ...(description !== undefined && { description }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Erro ao atualizar regra tributária:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE — Remove regra tributária
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.taxRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar regra tributária:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
