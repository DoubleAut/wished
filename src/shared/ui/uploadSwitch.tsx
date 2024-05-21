import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { UploadButton } from '../lib/fileUploader';
import { Button } from './button';

interface Props {
    onDelete: () => void;
    onUploading: () => void;
    onUploadComplete: (url: string) => void;
    onError: (message: string) => void;
}

type Picture = {
    key: string;
    name: string;
    size: number;
    type: string;
    url: string;
};

export const UploadSwitch = ({
    onDelete,
    onUploading,
    onUploadComplete,
    onError,
}: Props) => {
    const [picture, setPicture] = useState<Picture | null>(null);

    if (picture) {
        return (
            <div className="relative aspect-square w-full">
                <div className="absolute right-0 top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setPicture(null);

                            onDelete();
                        }}
                    >
                        <X />
                    </Button>
                </div>
                <Image
                    src={picture.url}
                    className="object-cover"
                    alt={picture.name}
                    fill
                />
            </div>
        );
    }

    return (
        <UploadButton
            endpoint="wishedUploader"
            onClientUploadComplete={(res: Picture[]) => {
                const file = res[0] as Picture;

                setPicture(file);

                onUploadComplete(file.url);
            }}
            onBeforeUploadBegin={(files) => {
                onUploading();

                return files;
            }}
            onUploadError={error => {
                onError(error.message);
            }}
        />
    );
};
