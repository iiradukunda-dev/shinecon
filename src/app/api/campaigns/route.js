import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        goal: Number(data.goal),
        raised: Number(data.raised || 0),
        currency: data.currency || 'RWF',
        startDate: new Date(data.startDate || new Date()),
        endDate: new Date(data.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        status: (data.status || 'ACTIVE').toUpperCase(),
        featured: data.featured === true,
        imageUrl: data.image || null,
      },
    });

    return NextResponse.json({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goal: Number(campaign.goal),
      raised: Number(campaign.raised),
      currency: campaign.currency,
      startDate: campaign.startDate.toISOString().split('T')[0],
      endDate: campaign.endDate.toISOString().split('T')[0],
      status: campaign.status.toLowerCase(),
      featured: campaign.featured,
      contributors: 0,
      image: campaign.imageUrl || '🏛️',
    });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.goal !== undefined) updateData.goal = Number(data.goal);
    if (data.raised !== undefined) updateData.raised = Number(data.raised);
    if (data.currency) updateData.currency = data.currency;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.status) updateData.status = data.status.toUpperCase();
    if (data.featured !== undefined) updateData.featured = data.featured === true;
    if (data.image) updateData.imageUrl = data.image;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: { donations: true },
    });

    return NextResponse.json({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goal: Number(campaign.goal),
      raised: Number(campaign.raised),
      currency: campaign.currency,
      startDate: campaign.startDate.toISOString().split('T')[0],
      endDate: campaign.endDate.toISOString().split('T')[0],
      status: campaign.status.toLowerCase(),
      featured: campaign.featured,
      contributors: campaign.donations.length,
      image: campaign.imageUrl || '🏛️',
    });
  } catch (error) {
    console.error('Failed to update campaign:', error);
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

    // Delete donations manually first
    await prisma.campaignDonation.deleteMany({
      where: { campaignId: id },
    });

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
