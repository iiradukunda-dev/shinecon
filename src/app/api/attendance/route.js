import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    const startTime = new Date(`${data.date || new Date().toISOString().split('T')[0]}T08:00:00Z`);
    const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours

    const attendanceEvent = await prisma.attendanceEvent.create({
      data: {
        title: data.event,
        qrCode: `qr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        qrExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        gpsRadius: Number(data.capacity || 250), // map capacity to gpsRadius for simplicity
        startTime,
        endTime,
      },
    });

    return NextResponse.json({
      id: attendanceEvent.id,
      event: attendanceEvent.title,
      date: attendanceEvent.startTime.toISOString().split('T')[0],
      total: Number(data.total || 0),
      capacity: attendanceEvent.gpsRadius,
    });
  } catch (error) {
    console.error('Failed to create attendance event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.event) updateData.title = data.event;
    if (data.capacity) updateData.gpsRadius = Number(data.capacity);
    if (data.date) {
      updateData.startTime = new Date(`${data.date}T08:00:00Z`);
      updateData.endTime = new Date(updateData.startTime.getTime() + 4 * 60 * 60 * 1000);
    }

    const attendanceEvent = await prisma.attendanceEvent.update({
      where: { id },
      data: updateData,
      include: { records: true },
    });

    return NextResponse.json({
      id: attendanceEvent.id,
      event: attendanceEvent.title,
      date: attendanceEvent.startTime.toISOString().split('T')[0],
      total: attendanceEvent.records.length || Number(data.total || 0),
      capacity: attendanceEvent.gpsRadius,
    });
  } catch (error) {
    console.error('Failed to update attendance event:', error);
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

    // Delete records manually first
    await prisma.attendanceRecord.deleteMany({
      where: { attendanceEventId: id },
    });

    await prisma.attendanceEvent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete attendance event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
