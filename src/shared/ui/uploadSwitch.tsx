import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from './button';
import { S3UploadZone } from './s3UploadZone';

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
            <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded">
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
        <S3UploadZone
            onUploadComplete={(url: string) => {
                setPicture({ key: url, url });

                onUploadComplete(url);
            }}
            onUploadError={(message: string) => {
                onError(message);
            }}
            onUploadStart={() => {
                onUploading();
            }}
        />
    );
};
