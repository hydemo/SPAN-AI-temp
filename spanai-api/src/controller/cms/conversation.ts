import { Controller, Get, Query, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { ConversationService } from 'src/module/conversation/conversation.service';

@ApiTags('admin/conversations')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/conversations')
export class CMSConversationController {
  constructor(@Inject(ConversationService) private conversationService: ConversationService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '消息列表', description: '消息列表' })
  async list(@Query() query: any) {
    return await this.conversationService.list(query);
  }
}
