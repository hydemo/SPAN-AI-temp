import { Body, Controller, Post, Inject, Request, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
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

  @Put('/password')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: '修改密码', description: '修改密码' })
  async resetMyPassword(@Body() reset: ResetMyPassDTO, @Request() req: any) {
    return await this.userService.resetMyPassword(req.user, reset);
  }
}
