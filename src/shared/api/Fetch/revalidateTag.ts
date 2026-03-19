'use server';

import { revalidateTag } from 'next/cache';

export const revalidateTagFromServer = async (tag: string) =>
    revalidateTag(tag, 'max');
