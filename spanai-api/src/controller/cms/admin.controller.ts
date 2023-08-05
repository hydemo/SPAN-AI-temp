import { Body, Controller, Get, Post, Query, UseGuards, Inject, Request, Put, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOkResponse, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDTO, ResetPassDTO, CodeVerifyDTO, NewPassDTO } from 'src/module/admin/admin.dto';
import { AdminService } from 'src/module/admin/admin.service';

@ApiTags('admin/users')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('admin')
export class CMSAdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {}
  @Post('/login')
  @ApiOkResponse({
    description: '登录成功',
  })
  @ApiOperation({ summary: '登录', description: '登录' })
  async login(@Body() login: LoginDTO, @Request() req): Promise<any> {
    const clientIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    return await this.adminService.login(login.username, login.password, clientIp);
  }

  @UseGuards(AuthGuard())
  @Put('/resetPass')
  @ApiOkResponse({
    description: '修改密码',
  })
  @ApiOperation({ summary: '修改密码', description: '修改密码' })
  async resetPass(@Request() req, @Body() reset: NewPassDTO): Promise<any> {
    return await this.adminService.resetNewPassword(req.user._id, reset);
  }

  @Get('/email/code')
  @ApiOkResponse({
    description: '发送邮箱验证码',
  })
  @ApiOperation({ summary: '发送邮箱验证码', description: '发送邮箱验证码' })
  async sendResetPassEmail(@Query('username') username: string): Promise<any> {
    return await this.adminService.sendEmailVerifyCode(username);
  }

  @Post('/email/code')
  @ApiOkResponse({
    description: '验证码校验',
  })
  @ApiOperation({ summary: '验证码校验', description: '验证码校验' })
  async codeVerify(@Body() reset: CodeVerifyDTO): Promise<any> {
    return await this.adminService.codeVerify(reset.username, reset.code);
  }

  @Put('/passForget')
  @ApiOkResponse({
    description: '重置密码',
  })
  @ApiOperation({ summary: '重置密码', description: '重置密码' })
  async passForget(@Body() reset: ResetPassDTO): Promise<any> {
    return await this.adminService.resetPassword(reset.username, reset);
  }

  @Get('/passForget')
  @ApiOkResponse({
    description: '重置密码',
  })
  @ApiOperation({ summary: '重置密码', description: '重置密码' })
  async forgetTokenCheck(@Query('token') token: string, @Response() res): Promise<any> {
    return await this.adminService.forgetTokenCheck(token, res);
  }
}
