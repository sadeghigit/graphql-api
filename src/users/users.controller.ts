import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { extname } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { Express } from 'express'

const userImagePipe = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({
            maxSize: 1 * 1024 * 1024,
            message: "max file size is 1MB"
        }),
        new FileTypeValidator({
            fileType: 'image/jpeg',
        }),
    ],
})

@Controller('users')
export class UsersController {

    @Get('user-image/:name')
    async getUserImageName(@Param('name') name: string, @Res() res) {
        const root = './uploads/user-image/';
        if (!existsSync(root + name)) throw new NotFoundException();
        return res.sendFile(name, { root });
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('user-image')
    async postUserImage(@UploadedFile(userImagePipe) file: Express.Multer.File) {
        const ext = extname(file.originalname.toLowerCase());
        file.filename = `${new Types.ObjectId()}${ext}`
        writeFileSync(`./uploads/user-image/${file.filename}`, file.buffer)
        return { link: '/users/user-image/' + file.filename };
    }
}
