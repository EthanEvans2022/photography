interface Photo {
    src: string;
    alt?: string;
    width: number;
    height: number;
    orientation: 'landscape' | 'portrait';
}