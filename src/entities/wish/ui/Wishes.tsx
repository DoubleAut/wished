import { Wish as IWish } from '@/shared/types/Wish';
import { Subheader } from '@/shared/ui/Text/subheader';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import Image from 'next/image';

interface WishesProps {
    wishes?: IWish[];
}

export const Wishes = ({ wishes }: WishesProps) => {
    if (!wishes) {
        return (
            <div className="flex flex-col gap-3">
                <Subheader>
                    <Skeleton />
                </Subheader>
                <div className="grid grid-cols-4 gap-3">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {wishes.map(item => (
                <Wish key={item.id} wish={item} />
            ))}
        </div>
    );
};

export const Wish = ({ wish }: { wish: IWish }) => {
    const date = new Date(wish.created_at);
    const splitted = [date.getDay(), date.getMonth(), date.getFullYear()];

    return (
        <div className="flex w-full flex-col">
            <div className="relative aspect-square overflow-hidden rounded">
                <Image
                    className="object-cover"
                    src={wish.picture ?? '/avatar_not_found.png'}
                    alt="Wish picture"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 200px, (max-width: 1024px) 200px"
                    fill
                />
                <Button
                    className="absolute right-0 top-0 rounded-full"
                    variant="ghost"
                    size="icon"
                ></Button>
            </div>
            <div className="flex flex-col space-y-2 px-3 py-3">
                <div>{wish.title}</div>
                <div className="flex justify-between">
                    <p>{wish.price}</p>
                    <p>{splitted.join('.')}</p>
                </div>
            </div>
        </div>
    );
};
