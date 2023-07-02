import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname } from 'path'

export const fileValidationConfig = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }), // 1MB
    new FileTypeValidator({ fileType: /\/(jpg|jpeg|png)$/ }),
  ],
})

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_, file, cb) => {
      const index = file.originalname.lastIndexOf('.')
      const originalfilename = file.originalname.slice(0, index)
      const newfilename =
        originalfilename + '-' + Date.now() + extname(file.originalname)
      cb(null, newfilename)
    },
  }),
}
