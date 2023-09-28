import * as fs from 'fs';
import { extname, join } from 'path';

import {
  Body,
  Controller,
  Post,
  Inject,
  Request,
  UseGuards,
  Put,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiForbiddenResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import * as moment from 'moment';
import * as multer from 'multer';
import { LoginDTO, ResetMyPassDTO } from 'src/module/user/user.dto';
import { UserService } from 'src/module/user/user.service';

@ApiTags('api/user')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/user')
export class ApiUserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Post('/login')
  @ApiOperation({ summary: '注册组织', description: '注册组织' })
  async login(@Body() login: LoginDTO, @Request() req: any) {
    const clientIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    return await this.userService.login(login.username, login.password, clientIp);
  }

  @Get('/usage')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '获取用户剩余token', description: '获取用户剩余token' })
  async usage(@Request() req: any) {
    return {
      expired: req.user.expired,
      singleQuestionToken: req.user.singleQuestionToken,
      singleChatToken: req.user.singleChatToken,
      questionCount: req.user.questionCount,
      model: req.user.model,
    };
  }

  @Put('/password')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '修改密码', description: '修改密码' })
  async resetMyPassword(@Body() reset: ResetMyPassDTO, @Request() req: any) {
    return await this.userService.resetMyPassword(req.user, reset);
  }

  @Post('/template/upload')
  @UseGuards(AuthGuard())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: join(`temp/upload`),
        filename: (req, file, cb) => {
          if (!fs.existsSync(join(`temp/upload/${req.user._id}`))) {
            fs.mkdirSync(join(`temp/upload/${req.user._id}`));
          }
          const extendName = extname(file.originalname);
          const baseName = file.originalname.replace(extendName, '');
          cb(null, `${req.user._id}/${baseName}+${moment().format('YYYY-MM-DD-HH-mm-ss')}${extendName}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: any) {
    return file.filename;
  }
}
