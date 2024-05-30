'use server';

import { revalidateTag } from 'next/cache';

export const revalidateTagFromServer = (tag: string) => revalidateTag(tag);
