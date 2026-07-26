import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category || 'General',
        priority: data.priority || 'normal',
        publishDate: new Date(data.date || new Date()),
        imageUrl: data.image || null,
      },
    });

    return NextResponse.json({
      id: announcement.id,
      title: announcement.title,
      category: announcement.category,
      priority: announcement.priority,
      date: announcement.publishDate.toISOString().split('T')[0],
      description: announcement.description,
      image: announcement.imageUrl || 'megaphone',
    });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.category) updateData.category = data.category;
    if (data.priority) updateData.priority = data.priority;
    if (data.date) updateData.publishDate = new Date(data.date);
    if (data.image) updateData.imageUrl = data.image;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: announcement.id,
      title: announcement.title,
      category: announcement.category,
      priority: announcement.priority,
      date: announcement.publishDate.toISOString().split('T')[0],
      description: announcement.description,
      image: announcement.imageUrl || 'megaphone',
    });
  } catch (error) {
    console.error('Failed to update announcement:', error);
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

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
