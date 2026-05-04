import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const baseDir = process.cwd()
const filePath = "files"

@Injectable()
export class FileService {

    getFilePath(fileName: string) {
        return `${baseDir}/${filePath}/${fileName}`
    }

    deleteFileByName(fileName: string) {
        fs.unlinkSync(this.getFilePath(fileName));
    }

    deleteMultipleFiles(files: string[]) {
        files.forEach((file) => {
            this.deleteFileByName(file)
        })
    }
}
