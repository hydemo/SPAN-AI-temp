import { Controller, Get, Post, Inject, Request, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateChatDTO } from 'src/module/chat/chat.dto';
import { ChatService } from 'src/module/chat/chat.service';

@ApiTags('api/chats')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/chats')
export class ApiChatController {
  constructor(@Inject(ChatService) private chatService: ChatService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '新增对话', description: '新增对话' })
  async create(@Request() req: any, @Body() chat: CreateChatDTO) {
    return await this.chatService.create(req.user._id, chat);
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '新增对话', description: '新增对话' })
  async list(@Request() req: any) {
    return await this.chatService.getChatsByUser(req.user._id);
  }
}
