import { Controller, Post, Get, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('start')
  async startConversation(@Req() req, @Body() dto: { otherUserId: string }) {
    return this.chatService.startConversation(req.user.id, dto.otherUserId);
  }

  @Post('message')
  async sendMessage(@Req() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user, dto);
  }

  @Get('my-chats')
  async getMyChats(@Req() req) {
    return this.chatService.getUserChats(req.user.id);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Query('limit') limit: number, @Query('offset') offset: number) {
    return this.chatService.getChatHistory(id, limit || 50, offset || 0);
  }
}
