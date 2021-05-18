// import { Request, Response } from 'express'
// import multer from "multer";
// import { controller, post, use } from '../decorators';
// import { checkForAuth } from '../middleware/auth';


// const upload = multer({
//     dest: "images"
// })

// function uploadSingle() {
//     upload.single('upload')
//     console.log('what')
// }

// @controller('/upload')
// class UploadController {
//     @post('/')
//     @use(uploadSingle)
//     @use(checkForAuth)
//     async uploadImageFile(req: Request, res: Response) {

//     }
// }