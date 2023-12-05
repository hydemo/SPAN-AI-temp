import { Controller, Post, Inject, UseGuards, Get, Query, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { CreateAssistantDTO } from 'src/module/assistant/assistant.dto';
import { AssistantService } from 'src/module/assistant/assistant.service';

@ApiTags('admin/assistants')
@UseGuards(AuthGuard())
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/assistants')
export class CMSAssistantsController {
  constructor(@Inject(AssistantService) private assistantService: AssistantService) {}

  @Get('/')
  @ApiOperation({ summary: '助手列表', description: '助手列表' })
  async list(@Query() query: any) {
    return await this.assistantService.list(query);
  }

  @Post('/')
  @ApiOperation({ summary: '新增助手', description: '新增助手' })
  async add(@Body() assistant: CreateAssistantDTO) {
    return await this.assistantService.create(assistant);
  }
}
