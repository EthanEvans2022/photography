import type IPhotoService from "./IPhotoService";
import fs from "fs";
import path from "path";
import imageSize from "image-size";

const PHOTOS_DIR = path.resolve("static/photos");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function fileToPhoto(file: string): Photo {
    const filePath = path.join(PHOTOS_DIR, file);
    const buffer = fs.readFileSync(filePath);
    const dimensions = imageSize(buffer);

    return {
        id: path.basename(file, path.extname(file)),
        src: `/photos/${file}`,
        alt: path.basename(file, path.extname(file)),
        width: dimensions.width ?? 0,
        height: dimensions.height ?? 0,
        orientation: dimensions.orientation === 1 ? 'landscape' : 'portrait'
    };
}

function getImageFiles(): string[] {
    return fs.readdirSync(PHOTOS_DIR).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
    });
}

export default class LocalPhotoService implements IPhotoService {
    getPhotos(): Photo[] {
        return getImageFiles().map(fileToPhoto);
    }

    getPhoto(id: string): Photo | undefined {
        const file = getImageFiles().find(
            (f) => path.basename(f, path.extname(f)) === id
        );
        if (!file) return undefined;
        return fileToPhoto(file);
    }
}
