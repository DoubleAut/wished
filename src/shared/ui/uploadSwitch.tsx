import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { UploadZone } from '../lib/fileUploader';
import { Button } from './button';

interface Props {
    savedPicture?: Picture;
    onDelete: (key: string) => void;
    onUploading: () => void;
    onUploadComplete: (url: string) => void;
    onError: (message: string) => void;
}

type Picture = {
    key: string;
    name?: string;
    size?: number;
    type?: string;
    url: string;
};

export const UploadSwitch = ({
    savedPicture,
    onDelete,
    onUploading,
    onUploadComplete,
    onError,
}: Props) => {
    const [picture, setPicture] = useState<Picture | null>(
        savedPicture ?? null,
    );

    if (picture) {
        return (
            <div className="relative aspect-square w-full">
                <div className="absolute right-0 top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setPicture(null);

                            onDelete(picture.key);
                        }}
                    >
                        <X />
                    </Button>
                </div>
                <Image
                    src={picture.url}
                    className="object-cover"
                    alt="wish image"
                    fill
                />
            </div>
        );
    }

    return (
        <UploadZone
            endpoint="wishedUploader"
            className="ut-button:bg-accent ut-allowed-content:text-foreground ut-label:text-primary"
            onClientUploadComplete={(res: Picture[]) => {
                const file = res[0] as Picture;

                setPicture(file);

                onUploadComplete(file.url);
            }}
            onBeforeUploadBegin={files => {
                onUploading();

                return files;
            }}
            onUploadError={error => {
                onError(error.message);
            }}
        />
    );
};
