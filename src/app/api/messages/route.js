import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();

    // Find user by name or default to first
    let user = await prisma.user.findFirst({
      where: { profile: { fullName: data.from } },
    });

    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'MEMBER' } });
    }

    if (!user) {
      return NextResponse.json({ error: 'No member found to assign message to' }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        subject: data.subject || 'Direct Message',
      },
    });

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        content: data.lastMessage || '',
        read: data.unread === false,
      },
      include: {
        sender: { include: { profile: true } },
        conversation: true,
      },
    });

    return NextResponse.json({
      id: message.id,
      from: message.sender.profile?.fullName || 'Anonymous',
      subject: message.conversation.subject,
      lastMessage: message.content,
      date: message.createdAt.toISOString().split('T')[0],
      unread: !message.read,
    });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {};
    if (data.unread !== undefined) {
      updateData.read = data.unread === false;
    }
    if (data.lastMessage) {
      updateData.content = data.lastMessage;
    }

    const message = await prisma.message.update({
      where: { id },
      data: updateData,
      include: {
        sender: { include: { profile: true } },
        conversation: true,
      },
    });

    return NextResponse.json({
      id: message.id,
      from: message.sender.profile?.fullName || 'Anonymous',
      subject: message.conversation.subject,
      lastMessage: message.content,
      date: message.createdAt.toISOString().split('T')[0],
      unread: !message.read,
    });
  } catch (error) {
    console.error('Failed to update message:', error);
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

    const message = await prisma.message.findUnique({ where: { id } });
    
    await prisma.message.delete({
      where: { id },
    });

    if (message) {
      // Clean up conversation if empty
      const remaining = await prisma.message.count({
        where: { conversationId: message.conversationId },
      });
      if (remaining === 0) {
        await prisma.conversation.delete({
          where: { id: message.conversationId },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
