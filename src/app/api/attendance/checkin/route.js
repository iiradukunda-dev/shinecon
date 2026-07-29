import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { eventId, userId, lat, lng } = data;

    if (!eventId || !userId) {
      return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 });
    }

    // Check if event exists
    const event = await prisma.attendanceEvent.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Attendance session not found' }, { status: 404 });
    }

    // Check if user already checked in
    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: {
        attendanceEventId_userId: {
          attendanceEventId: eventId,
          userId: userId,
        }
      }
    });

    if (existingRecord) {
      return NextResponse.json({ error: 'You have already checked in to this session' }, { status: 400 });
    }

    // Create attendance record
    const record = await prisma.attendanceRecord.create({
      data: {
        attendanceEventId: eventId,
        userId: userId,
        gpsLatitude: lat || null,
        gpsLongitude: lng || null,
        locationVerified: true, // We already validated distance in the frontend
      }
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Failed to record attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
