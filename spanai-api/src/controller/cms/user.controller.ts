import * as fs from 'fs';
import { extname, join } from 'path';

import {
  Body,
  Controller,
  Post,
  Inject,
  Put,
  UseGuards,
  Get,
  Query,
  Param,
  Request,
  Response,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import * as multer from 'multer';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { CreateUserDTO, Password, UpdateUserDTO } from 'src/module/user/user.dto';
import { UserService } from 'src/module/user/user.service';

@ApiTags('admin/user')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin/users')
export class CMSUserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get('/')
  @ApiOperation({ summary: '用户列表', description: '用户列表' })
  async users(@Query() params: any) {
    return await this.userService.list(params);
  }

  @UseGuards(AuthGuard())
  @Post('/')
  @ApiOperation({ summary: '新增用户', description: '新增用户' })
  async addUser(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }

  @UseGuards(AuthGuard())
  @Put('/:id')
  @ApiOperation({ summary: '修改用户', description: '修改用户' })
  async updateUser(@Param('id', new MongodIdPipe()) id: string, @Body() body: UpdateUserDTO) {
    return await this.userService.update(id, body);
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  @ApiOperation({ summary: '修改用户', description: '修改用户' })
  async deleteUser(@Param('id', new MongodIdPipe()) id: string, @Body() body: UpdateUserDTO) {
    return await this.userService.delete(id);
  }

  @UseGuards(AuthGuard())
  @Put('/:id/password')
  @ApiOperation({ summary: '修改用户密码', description: '修改用户密码' })
  async updateUserPassword(@Param('id', new MongodIdPipe()) id: string, @Body() body: Password) {
    return await this.userService.resetPassword(id, body);
  }

  @UseGuards(AuthGuard())
  @Get('/:id/reports')
  @ApiOperation({ summary: '获取用户上传的报告', description: '获取用户上传的报告' })
  async getUserReports(@Param('id', new MongodIdPipe()) id: string) {
    return await this.userService.reports(id);
  }

  @Get('/template')
  @ApiOperation({ summary: '获取模版', description: '获取模版' })
  async register(@Request() req: any, @Query('language') language: string, @Response() res: any) {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const filename = '模板.xlsx';
    const path = `temp/template/${filename}`;
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
        return;
      })
      .on('error', (error) => {
        console.log(error);
        // throw new ApiE('服务器异常', ApiErrorCode.INTERNAL_ERROR, 500);
      });
  }

  @Post('/template/upload')
  @UseGuards(AuthGuard())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: join('temp/excel'),
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
    return await this.userService.uploadTemplate('temp/excel', file.filename);
  }

  @Get('/:id/reports/download')
  @ApiOperation({ summary: '下载报告', description: '下载报告' })
  async downloadReport(
    @Request() req: any,
    @Param('id', new MongodIdPipe()) userId: string,
    @Query('reportName') reportName: string,
    @Response() res: any,
  ) {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const path = join(`temp/upload/${userId}/${reportName}`);
    console.log(path, 'path');
    let disposition;
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
      disposition = `attachment; filename=${encodeURIComponent(reportName)}`;
    } else if (userAgent.indexOf('firefox') >= 0) {
      disposition = `attachment; filename*="utf8''${encodeURIComponent(reportName)}"`;
    } else {
      /* safari等其他非主流浏览器只能自求多福了 */
      disposition = `attachment; filename=${Buffer.from(reportName).toString('binary')}`;
    }
    res.setHeader('Content-Type', 'application/octet-stream;charset=utf8');
    res.setHeader('Content-Disposition', disposition);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    const stream = fs.createReadStream(path);
    stream.pipe(res);
  }
}
