import { Injectable } from '@nestjs/common';
import * as md5 from 'md5';
import { CreateAdminDTO } from 'src/module/admin/admin.dto';
import { AdminService } from 'src/module/admin/admin.service';

@Injectable()
export class InitService {
  constructor(private readonly adminService: AdminService) {}

  async init() {
    const adminExist = await this.adminService.count();
    if (!adminExist) {
      const admin: CreateAdminDTO = {
        username: 'spanai',
        password: md5('admin'),
        email: 'span@sem.tsinghua.edu.cn ',
        phone: '13111111111',
        role: 0,
      };
      await this.adminService.create(admin);
    }
  }
}
