import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { ChatService } from 'src/module/chat/chat.service';

@ApiTags('cms/chats')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/chats')
export class CMSChatController {
  constructor(@Inject(ChatService) private chatService: ChatService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '对话列表', description: '对话列表' })
  async list(@Query() query: any) {
    return await this.chatService.list(query);
  }
}
