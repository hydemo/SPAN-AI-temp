import { Controller, Get, Post, Inject, Request, UseGuards, Body, Query, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from 'src/module/chat/chat.service';
import { SendMessageDTO } from 'src/module/conversation/conversation.dto';
import { ConversationService } from 'src/module/conversation/conversation.service';

@ApiTags('api/conversations')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/conversations')
@ApiBearerAuth()
export class ApiConversationController {
  constructor(
    @Inject(ConversationService) private conversationService: ConversationService,
    private chatService: ChatService,
  ) {}

  @Post('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '发送消息', description: '发送消息' })
  async create(@Request() req: any, @Body() message: SendMessageDTO, @Response() res: any) {
    const chat = await this.chatService.getChatsById(message.chatId);
    if (chat.type === 'image') {
      const data = await this.conversationService.sendImageMessage(req.user, message);
      res.data(data);
      res.end();
    }
    const response: any = await this.conversationService.sendConversationMessage(req.user, message);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    response.data.pipe(res);
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '消息列表', description: '消息列表' })
  async list(@Query('chatId') chatId: string) {
    return await this.conversationService.getMessageByChat(chatId);
  }
}
