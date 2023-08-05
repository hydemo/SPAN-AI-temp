import { Controller, Get, Post, Inject, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { ChatService } from 'src/module/chat/chat.service';

@ApiTags('api/chats')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/chats')
export class ApiUserController {
  constructor(@Inject(ChatService) private chatService: ChatService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '新增对话', description: '新增对话' })
  async create(@Request() req: any) {
    return await this.chatService.create(req.user._id);
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '新增对话', description: '新增对话' })
  async list(@Request() req: any) {
    return await this.chatService.getChatsByUser(req.user._id);
  }
}
