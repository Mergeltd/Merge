import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat.repository';
import { SendMessageDto } from '../dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly repository: ChatRepository) {}

  async startConversation(userId1: string, userId2: string) {
    return this.repository.findOrCreateDirectChat(userId1, userId2);
  }

  async sendMessage(user: any, dto: SendMessageDto) {
    const message = await this.repository.sendMessage(dto, user.id);
    // Integration Point: Trigger Realtime Notification via Supabase/FCM here
    return message;
  }

  async getUserChats(userId: string) {
    return this.repository.findChatsByUser(userId);
  }

  async getChatHistory(chatId: string, limit: number, offset: number) {
    return this.repository.getMessages(chatId, limit, offset);
  }
}
