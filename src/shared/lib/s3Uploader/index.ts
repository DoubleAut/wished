'use client';

import { getAccessToken } from '@/shared/api/Fetch/accessToken';
import { UPLOAD_ENDPOINT } from '@/shared/lib/constants/Config';

interface PresignResponse {
    presignedUrl: string;
    publicUrl: string;
    key: string;
}

interface PresignRequest {
    fileName: string;
    fileType: string;
    fileSize: number;
}

interface UploadProgressCallbacks {
    onProgress: (progress: number) => void;
    onError: (message: string) => void;
}

/**
 * Request a presigned URL from the upload API.
 */
const requestPresignedUrl = async (file: File): Promise<PresignResponse> => {
    const accessToken = getAccessToken();

    const body: PresignRequest = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
    };

    const response = await fetch(`${UPLOAD_ENDPOINT}/upload/presign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');

        throw new Error(
            `Failed to get presigned URL: ${response.status} ${errorBody}`,
        );
    }

    const data = (await response.json()) as PresignResponse;

    return data;
};

/**
 * Upload a file to S3 using XMLHttpRequest for progress tracking.
 */
const uploadToS3 = (
    presignedUrl: string,
    file: File,
    callbacks: UploadProgressCallbacks,
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);

                callbacks.onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                callbacks.onError(`Upload failed with status ${xhr.status}`);
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            const message = 'Network error during upload';

            callbacks.onError(message);
            reject(new Error(message));
        });

        xhr.addEventListener('abort', () => {
            const message = 'Upload was aborted';

            callbacks.onError(message);
            reject(new Error(message));
        });

        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
    });
};

/**
 * Upload a file using the presigned URL flow.
 * Returns the public URL and S3 key on success.
 */
export const uploadFile = async (
    file: File,
    callbacks: UploadProgressCallbacks,
): Promise<{ publicUrl: string; key: string }> => {
    const { presignedUrl, publicUrl, key } = await requestPresignedUrl(file);

    await uploadToS3(presignedUrl, file, callbacks);

    return { publicUrl, key };
};
