import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    const type = await prisma.contributionType.create({
      data: {
        name: data.name,
        description: data.description || '',
        category: data.category || 'Regular',
        localStudentAmt: Number(data.localStudent || 0),
        localEmployedAmt: Number(data.localEmployed || 0),
        diasporaStudentAmt: Number(data.diasporaStudent || 0),
        diasporaEmployedAmt: Number(data.diasporaEmployed || 0),
        localCurrency: data.currency?.local || 'RWF',
        diasporaCurrency: data.currency?.diaspora || 'USD',
        recurring: data.recurring === true,
        active: true,
        icon: data.icon || '💰',
        color: data.color || '#D4A843',
      },
    });

    return NextResponse.json({
      id: type.id,
      name: type.name,
      description: type.description,
      category: type.category,
      localStudent: Number(type.localStudentAmt),
      localEmployed: Number(type.localEmployedAmt),
      diasporaStudent: Number(type.diasporaStudentAmt),
      diasporaEmployed: Number(type.diasporaEmployedAmt),
      currency: { local: type.localCurrency, diaspora: type.diasporaCurrency },
      recurring: type.recurring,
      active: type.active,
      icon: type.icon,
      color: type.color,
    });
  } catch (error) {
    console.error('Failed to create contribution type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category) updateData.category = data.category;
    if (data.localStudent !== undefined) updateData.localStudentAmt = Number(data.localStudent);
    if (data.localEmployed !== undefined) updateData.localEmployedAmt = Number(data.localEmployed);
    if (data.diasporaStudent !== undefined) updateData.diasporaStudentAmt = Number(data.diasporaStudent);
    if (data.diasporaEmployed !== undefined) updateData.diasporaEmployedAmt = Number(data.diasporaEmployed);
    if (data.currency?.local) updateData.localCurrency = data.currency.local;
    if (data.currency?.diaspora) updateData.diasporaCurrency = data.currency.diaspora;
    if (data.recurring !== undefined) updateData.recurring = data.recurring === true;
    if (data.active !== undefined) updateData.active = data.active === true;
    if (data.icon) updateData.icon = data.icon;
    if (data.color) updateData.color = data.color;

    const type = await prisma.contributionType.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: type.id,
      name: type.name,
      description: type.description,
      category: type.category,
      localStudent: Number(type.localStudentAmt),
      localEmployed: Number(type.localEmployedAmt),
      diasporaStudent: Number(type.diasporaStudentAmt),
      diasporaEmployed: Number(type.diasporaEmployedAmt),
      currency: { local: type.localCurrency, diaspora: type.diasporaCurrency },
      recurring: type.recurring,
      active: type.active,
      icon: type.icon,
      color: type.color,
    });
  } catch (error) {
    console.error('Failed to update contribution type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await prisma.contribution.deleteMany({
      where: { contributionTypeId: id },
    });

    await prisma.contributionType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete contribution type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
