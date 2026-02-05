import type IPhotoService from "./IPhotoService";
import fs from "fs";
import path from "path";
import imageSize from "image-size";

const PHOTOS_DIR = path.resolve("static/photos");

export default class LocalPhotoService implements IPhotoService {
    getPhotos(): Photo[] {
        const files = fs.readdirSync(PHOTOS_DIR);
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

        return files
            .filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return imageExtensions.includes(ext);
            })
            .map((file) => {
                const filePath = path.join(PHOTOS_DIR, file);
                const buffer = fs.readFileSync(filePath);
                const dimensions = imageSize(buffer);

                return {
                    src: `/photos/${file}`,
                    alt: path.basename(file, path.extname(file)),
                    width: dimensions.width ?? 0,
                    height: dimensions.height ?? 0
                };
            });
    }
} 