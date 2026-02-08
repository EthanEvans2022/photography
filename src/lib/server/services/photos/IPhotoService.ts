export default interface IPhotoService {
    getPhotos(): Photo[];
    getPhoto(id: string): Photo | undefined;
}