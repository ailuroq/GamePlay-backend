import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { extname } from 'path';

@Controller()
export class FileUploadingController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const finalFileName = `${name}-${randomName}${fileExtName}`;
          callback(null, finalFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file, @Request() req) {
    return this.userService.createAvatar(file.filename, req.user);
  }

  @Get('uploads/:imgPath')
  seeUploadedFile(@Param('imgPath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }
}
