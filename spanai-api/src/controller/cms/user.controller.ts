import { Body, Controller, Post, Inject, Put, UseGuards, Get, Query, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { MongodIdPipe } from 'src/common/pipe/mongodId.pipe';
import { CreateUserDTO, UpdateUserDTO } from 'src/module/user/user.dto';
import { UserService } from 'src/module/user/user.service';

@ApiTags('api/user')
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
}
