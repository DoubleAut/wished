'use client';

import { cn } from '@/shared/lib/classNames/cn';
import { uploadFile } from '@/shared/lib/s3Uploader';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface S3UploadZoneProps {
    onUploadComplete: (url: string) => void;
    onUploadError: (message: string) => void;
    onUploadStart: () => void;
}

export const S3UploadZone = ({
    onUploadComplete,
    onUploadError,
    onUploadStart,
}: S3UploadZoneProps) => {
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFile = useCallback(
        async (file: File) => {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!allowedTypes.includes(file.type)) {
                onUploadError('Invalid file type. Allowed: JPEG, PNG, WebP');

                return;
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024;

            if (file.size > maxSize) {
                onUploadError('File size exceeds 5MB limit');

                return;
            }

            setIsUploading(true);
            setUploadProgress(0);
            onUploadStart();

            try {
                const { publicUrl } = await uploadFile(file, {
                    onProgress: setUploadProgress,
                    onError: onUploadError,
                });

                onUploadComplete(publicUrl);
            } catch (err: unknown) {
                const error = err as Error;

                onUploadError(error.message ?? 'Upload failed');
            } finally {
                setIsUploading(false);
                setUploadProgress(null);
            }
        },
        [onUploadComplete, onUploadError, onUploadStart],
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            if (file) {
                handleFile(file).catch(() => {});
            }
        },
        [handleFile],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        disabled: isUploading,
    });

    if (isUploading) {
        return (
            <div className="border-accent/30 bg-accent/[0.03] mx-auto flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                <div className="text-muted-foreground text-sm font-medium">
                    Uploading...
                </div>
                {uploadProgress !== null && (
                    <div className="bg-accent/20 h-2 w-3/4 overflow-hidden rounded-full">
                        <div
                            className="bg-accent h-full rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
                <div className="text-muted-foreground/60 text-xs">
                    {uploadProgress}%
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                'border-accent/30 bg-accent/[0.03] hover:border-accent/50 mx-auto flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors',
                isDragActive && 'border-accent bg-accent/10',
            )}
        >
            <input {...getInputProps()} />
            <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-full">
                <ImagePlus className="text-accent h-5 w-5" />
            </div>
            <div className="text-center">
                <p className="text-foreground/80 text-sm font-medium">
                    {isDragActive
                        ? 'Drop your image here'
                        : 'Drag & drop an image'}
                </p>
                <p className="text-muted-foreground/60 mt-1 text-xs">
                    or click to browse
                </p>
            </div>
            <p className="text-muted-foreground/50 text-xs">
                JPEG, PNG, WebP · Max 5MB
            </p>
        </div>
    );
};
