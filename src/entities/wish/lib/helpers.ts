import { Wish } from '@/shared/types/Wish';

export const getDefaultValues = (dialogWish: Partial<Wish> | null) => {
    if (!dialogWish) {
        return {
            title: '',
            description: '',
            price: 0,
            canBeAnon: false,
            isHidden: false,
            giftDay: undefined,
            picture: null,
            categoryId: null,
        };
    }

    return {
        title: dialogWish.title ?? '',
        description: dialogWish.description ?? '',
        price: dialogWish.price ?? 0,
        canBeAnon: dialogWish.canBeAnon ?? false,
        isHidden: dialogWish.isHidden ?? false,
        giftDay: dialogWish.giftDay ? new Date(dialogWish.giftDay) : undefined,
        picture: dialogWish.picture ?? null,
        categoryId: dialogWish.categoryId ?? null,
    };
};

export const getImageKey = (picture: string) =>
    picture.split('/').at(-1) as string;

export const getImageObject = (picture: string) => ({
    key: getImageKey(picture),
    url: picture,
});
