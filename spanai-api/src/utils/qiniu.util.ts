import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qiniu from 'qiniu';
import { ConfigService } from 'src/config/config.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QiniuUtil {
  private path = 'temp/image';
  constructor(private readonly config: ConfigService) {}

  getToken() {
    const mac = new qiniu.auth.digest.Mac(this.config.qiniuAccessKey, this.config.qiniuSecretKey);
    const options = {
      scope: this.config.qiniuBucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  }

  async uploadSingleFile(path: string, key: string, uploadToken: string) {
    const zone = {
      srcUpHosts: ['up-cn-east-2.qiniup.com'],
      cdnUpHosts: ['upload-cn-east-2.qiniup.com'],
      ioHost: 'iovip-cn-east-2.qiniuio.com',
      rsHost: 'rs-cn-east-2.qiniuapi.com',
      rsfHost: 'rsf-cn-east-2.qiniuapi.com',
      apiHost: 'api.qiniuapi.com',
    };
    const config = new qiniu.conf.Config({ zone });
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    // 文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, path, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  async download(imageUrl: string, outputPath: string) {
    const res = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
    });
    res.data.pipe(fs.createWriteStream(outputPath));
    return new Promise((resolve, reject) => {
      res.data.on('end', () => {
        resolve(true);
      });

      res.data.on('error', (err) => {
        reject(err);
      });
    });
  }

  async saveImage(url: string) {
    const key = uuid();
    const outputPath = `${this.path}/${key}.png`;
    await this.download(url, outputPath);
    const uploadToken = this.getToken();
    await this.uploadSingleFile(outputPath, `spanai/${key}.png`, uploadToken);
    fs.unlinkSync(outputPath);
    return `http://qn.greatwebtech.cn/spanai/${key}.png`;
  }
}
