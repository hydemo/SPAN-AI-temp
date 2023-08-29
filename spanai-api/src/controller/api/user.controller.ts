import { Body, Controller, Post, Inject, Request } from '@nestjs/common';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDTO } from 'src/module/user/user.dto';
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
}
