'use client';

import { generateUploadButton } from '@uploadthing/react';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export const UploadButton = generateUploadButton({
    url: `${API_URL}/uploadthing`,
});
