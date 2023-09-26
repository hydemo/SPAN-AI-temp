import * as fs from 'fs';

import { Controller, Get, Query, Inject, UseGuards, Request, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { ConversationService } from 'src/module/conversation/conversation.service';

@ApiTags('admin/conversations')
@UseGuards(AuthGuard())
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/conversations')
export class CMSConversationController {
  constructor(@Inject(ConversationService) private conversationService: ConversationService) {}

  @Get('/')
  @ApiOperation({ summary: '消息列表', description: '消息列表' })
  async list(@Query() query: any) {
    return await this.conversationService.list(query);
  }

  @Get('/download')
  @ApiOperation({ summary: '下载', description: '下载' })
  async download(@Query('type') type: string, @Request() req: any, @Response() res: any) {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const filename = await this.conversationService.download(type);
    const path = `temp/download/${filename}`;
    let disposition;
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
      disposition = `attachment; filename=${encodeURIComponent(filename)}`;
    } else if (userAgent.indexOf('firefox') >= 0) {
      disposition = `attachment; filename*="utf8''${encodeURIComponent(filename)}"`;
    } else {
      /* safari等其他非主流浏览器只能自求多福了 */
      disposition = `attachment; filename=${Buffer.from(filename).toString('binary')}`;
    }
    res.setHeader('Content-Type', 'application/octet-stream;charset=utf8');
    res.setHeader('Content-Disposition', disposition);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    const stream = fs.createReadStream(path);
    stream.pipe(res);
    stream
      .on('end', () => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
        return;
      })
      .on('error', (error) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
        console.log(error);
      });
  }
}
