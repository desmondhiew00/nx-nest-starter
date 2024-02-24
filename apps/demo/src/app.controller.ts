import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import "multer"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
