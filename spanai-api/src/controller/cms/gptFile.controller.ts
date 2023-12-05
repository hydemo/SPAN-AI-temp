import { extname, join } from 'path';

import { Controller, Post, Inject, UseGuards, Get, UseInterceptors, UploadedFile, Query, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import * as multer from 'multer';
import { CreateGPTFileDTO } from 'src/module/gptFile/gptFile.dto';
import { GPTFileService } from 'src/module/gptFile/gptFile.service';

@ApiTags('admin/gptFiles')
@UseGuards(AuthGuard())
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/gptFiles')
export class CMSGPTFileController {
  constructor(@Inject(GPTFileService) private gptFileService: GPTFileService) {}

  @Get('/')
  @ApiOperation({ summary: '文件', description: '文件列表' })
  async list(@Query() query: any) {
    return await this.gptFileService.list(query);
  }

  @Post('/')
  @ApiOperation({ summary: '上传文件', description: '上传文件' })
  async add(@Body() gptFile: CreateGPTFileDTO) {
    return await this.gptFileService.create(gptFile);
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
}
