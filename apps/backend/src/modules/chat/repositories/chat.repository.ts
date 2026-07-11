import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateChatDto, SendMessageDto } from '../dto/chat.dto';

@Injectable()
export class ChatRepository {
  constructor(private prisma: PrismaService) {}

  async createChat(data: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        type: data.type,
        bookingId: data.bookingId,
        participants: {
          create: data.userIds.map(id => ({ userId: id })),
        },
      },
    });
  }

  async sendMessage(data: SendMessageDto, senderId: string) {
    return this.prisma.message.create({
      data: {
        chatId: data.chatId,
        senderId: senderId,
        content: data.content,
        type: data.type,
        mediaKey: data.mediaKey,
      },
    });
  }

  async findChatsByUser(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: { include: { user: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(chatId: string, limit = 50, offset = 0) {
    return this.prisma.message.findMany({
      where: { chatId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  async findOrCreateDirectChat(userId1: string, userId2: string) {
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
    });

    if (existingChat) return existingChat;

    return this.createChat({
      userIds: [userId1, userId2],
      type: 'DIRECT',
    });
  }
}
