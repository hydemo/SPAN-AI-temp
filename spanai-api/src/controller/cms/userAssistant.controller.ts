import { Controller, Post, Inject, UseGuards, Get, Query, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserAssistantsDTO } from 'src/module/userAssistant/userAssistant.dto';
import { UserAssistantsService } from 'src/module/userAssistant/userAssistant.service';

@ApiTags('admin/userAssistants')
@UseGuards(AuthGuard())
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/userAssistants')
export class CMSUserAssistantsController {
  constructor(@Inject(UserAssistantsService) private userAssistantsService: UserAssistantsService) {}

  @Get('/')
  @ApiOperation({ summary: '用户助手列表', description: '用户助手列表' })
  async list(@Query() query: any) {
    return await this.userAssistantsService.list(query);
  }

  @Post('/')
  @ApiOperation({ summary: '新增用户助手', description: '新增用户助手' })
  async add(@Body() userAssistant: CreateUserAssistantsDTO) {
    return await this.userAssistantsService.create(userAssistant);
  }
}
