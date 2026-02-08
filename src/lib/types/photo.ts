interface Photo {
    id: string;
    src: string;
    alt?: string;
    width: number;
    height: number;
    orientation: 'landscape' | 'portrait';
}