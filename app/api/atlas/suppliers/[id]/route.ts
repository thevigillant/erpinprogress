import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const supplier = await (prisma as any).supplier.update({
      where: { id },
      data: {
        observacoes: data.obs,
        email: data.email,
        telefone: data.telefone,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    return NextResponse.json({ detail: "Erro ao atualizar fornecedor" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    await (prisma as any).supplier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar fornecedor:", error);
    return NextResponse.json({ detail: "Erro ao deletar fornecedor" }, { status: 500 });
  }
}
