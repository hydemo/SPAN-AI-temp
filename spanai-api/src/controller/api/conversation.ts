import { Controller, Get, Post, Inject, Request, UseGuards, Body, Query, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SendMessageDTO } from 'src/module/conversation/conversation.dto';
import { ConversationService } from 'src/module/conversation/conversation.service';

@ApiTags('api/conversations')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/conversations')
@ApiBearerAuth()
export class ApiConversationController {
  constructor(@Inject(ConversationService) private conversationService: ConversationService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '发送消息', description: '发送消息' })
  async create(@Request() req: any, @Body() message: SendMessageDTO, @Response() res: any) {
    const response: any = this.conversationService.sendMessage(req.user, message);
    response.pipe(res);
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '消息列表', description: '消息列表' })
  async list(@Query('chatId') chatId: string) {
    return await this.conversationService.getMessageByChat(chatId);
  }
}
