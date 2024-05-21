import { Wish as IWish } from '@/shared/types/Wish';
import { Subheader } from '@/shared/ui/Text/subheader';
import { Button } from '@/shared/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WishesProps {
    subheader: string;
    wishes: IWish[];
}

export const Wishes = ({ subheader, wishes }: WishesProps) => (
    <div className="flex flex-col gap-3">
        <Subheader>{subheader}</Subheader>
        <div className="grid grid-cols-4 gap-3">
            {wishes.map(item => (
                <Wish key={item.id} wish={item} />
            ))}
        </div>
    </div>
);

export const MakeWish = ({ href }: { href: string }) => (
    <Link href={href}>
        <Button className="w-full">+ Make a wish</Button>
    </Link>
);

export const Wish = ({ wish }: { wish: IWish }) => (
    <div className="aspect-square rounded-md bg-slate-500 p-1">
        <div className="relative">
            {wish.picture && (
                <>
                    <div className="relative aspect-square w-full">
                        <Image
                            className="object-contain"
                            src={wish.picture}
                            alt="Wish picture"
                            fill
                        />
                    </div>
                    <div className="absolute right-0 top-0">
                        <MoreHorizontal />
                    </div>
                </>
            )}

            {!wish.picture && (
                <>
                    <div className="relative aspect-square w-full">
                        <Image
                            className="object-contain"
                            src="/avatar_not_found.png"
                            alt="Wish picture"
                            fill
                        />
                    </div>
                    <div className="absolute right-0 top-0">
                        <MoreHorizontal />
                    </div>
                </>
            )}
        </div>
        <div className="flex flex-col gap-2 text-white">
            <p className="text-md font-bold">{wish.title}</p>
            {wish.price && <p className="text-sm">{wish.price}</p>}
        </div>
    </div>
);
