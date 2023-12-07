import { Controller, Post, Inject, UseGuards, Get, Body, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { AssistantMessageDTO } from 'src/module/userAssistant/userAssistant.dto';
import { UserAssistantsService } from 'src/module/userAssistant/userAssistant.service';

@ApiTags('api/assistants')
@UseGuards(AuthGuard())
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/assistants')
export class ApiAssistantsController {
  constructor(@Inject(UserAssistantsService) private userAssistantsService: UserAssistantsService) {}

  @Get('/')
  @ApiOperation({ summary: '助手列表', description: '助手列表' })
  async list(@Request() req: any) {
    return await this.userAssistantsService.listByUser(req.user._id);
  }

  @Post('/conversation')
  @ApiOperation({ summary: '聊天', description: '聊天' })
  async add(@Request() req: any, @Body() assistant: AssistantMessageDTO) {
    return await this.userAssistantsService.conversation(req.user, assistant);
  }
}
