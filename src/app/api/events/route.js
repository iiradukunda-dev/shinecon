import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    const startTime = new Date(`${data.date}T${data.time || '00:00'}:00Z`);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours default

    const event = await prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description || '',
        location: data.location || '',
        category: data.category || 'General',
        startTime,
        endTime,
        recurring: data.recurring === true,
      },
    });

    return NextResponse.json({
      id: event.id,
      title: event.title,
      date: event.startTime.toISOString().split('T')[0],
      time: event.startTime.toISOString().split('T')[1].substring(0, 5),
      location: event.location,
      category: event.category,
      recurring: event.recurring,
      description: event.description,
    });
  } catch (error) {
    console.error('Failed to create calendar event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.category) updateData.category = data.category;
    if (data.recurring !== undefined) updateData.recurring = data.recurring === true;

    if (data.date || data.time) {
      const currentEvent = await prisma.calendarEvent.findUnique({ where: { id } });
      if (currentEvent) {
        const currentDate = data.date || currentEvent.startTime.toISOString().split('T')[0];
        const currentTime = data.time || currentEvent.startTime.toISOString().split('T')[1].substring(0, 5);
        updateData.startTime = new Date(`${currentDate}T${currentTime}:00Z`);
        updateData.endTime = new Date(updateData.startTime.getTime() + 2 * 60 * 60 * 1000);
      }
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: event.id,
      title: event.title,
      date: event.startTime.toISOString().split('T')[0],
      time: event.startTime.toISOString().split('T')[1].substring(0, 5),
      location: event.location,
      category: event.category,
      recurring: event.recurring,
      description: event.description,
    });
  } catch (error) {
    console.error('Failed to update calendar event:', error);
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

    await prisma.calendarEvent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
