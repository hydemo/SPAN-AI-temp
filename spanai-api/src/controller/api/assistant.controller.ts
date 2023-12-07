import { extname, join } from 'path';

import { Controller, Post, Inject, UseGuards, Get, Body, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import * as multer from 'multer';
import { AssistantMessageDTO, CreateUserAssistantsByUserDTO } from 'src/module/userAssistant/userAssistant.dto';
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

  @Post('/')
  @ApiOperation({ summary: '创建助手', description: '创建助手' })
  async create(@Request() req: any, @Body() assistant: CreateUserAssistantsByUserDTO) {
    return await this.userAssistantsService.createUserAssistants(req.user, assistant);
  }

  @Post('/upload')
  @UseGuards(AuthGuard())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: join('temp/gptFile'),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: any) {
    return file.filename;
  }

  @Post('/conversation')
  @ApiOperation({ summary: '聊天', description: '聊天' })
  async add(@Request() req: any, @Body() assistant: AssistantMessageDTO) {
    return await this.userAssistantsService.conversation(req.user, assistant);
  }
}
