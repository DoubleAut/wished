import { useViewerStore } from '@/core/providers/ViewerProvider';
import { cn } from '@/shared/lib/classNames/cn';
import { Wish } from '@/shared/types/Wish';
import { Typography } from '@/shared/ui/Text/typography';
import { AspectRatio } from '@/shared/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { RiEyeLine, RiEyeOffLine, RiGiftLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const Badges = ({ wish }: { wish: Wish }) => {
    const viewer = useViewerStore(state => state.user);
    const isReservedByViewer =
        wish.isReserved && wish.reservedBy?.id === viewer?.id;
    const isHidden = viewer?.id === wish.owner.id && wish.isHidden;
    const isOwnPresent = wish.owner.id === viewer?.id;

    return (
        <div className="inherit">
            {isHidden && (
                <Badge className="rounded-full bg-muted p-1 text-primary">
                    <RiEyeOffLine className="h-4 w-4" />
                </Badge>
            )}
            {!isHidden && isOwnPresent && (
                <Badge className="rounded-full bg-muted p-1 text-primary">
                    <RiEyeLine className="h-4 w-4" />
                </Badge>
            )}
            {isReservedByViewer && (
                <Badge className="rounded-full bg-muted p-1 text-primary">
                    <RiGiftLine className="h-4 w-4" />
                </Badge>
            )}
        </div>
    );
};

export const Background = ({
    isHover,
    text,
}: {
    text: string;
    isHover: boolean;
}) => {
    return (
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-accent">
            <Image
                src="/placeholder-light.jpg"
                className={cn(
                    'background-cover brightness-75 transition-all',
                    isHover && 'scale-105',
                )}
                alt="placeholder"
                fill
            />
            <p className="z-10 text-center font-bold text-secondary">
                {text.toUpperCase()}
            </p>
        </div>
    );
};

const MotionRatio = motion(AspectRatio);

export const WishCard = ({ wish }: { wish: Wish }) => {
    const [isHover, setHover] = useState(false);
    const date = new Date(wish.created_at);
    const splitted = [date.getDay(), date.getMonth(), date.getFullYear()];

    return (
        <MotionRatio
            ratio={4 / 3}
            className="relative flex flex-col justify-end overflow-hidden rounded"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {wish.picture ? (
                <Image
                    className={cn(
                        '-z-10 object-cover brightness-75 transition-transform',
                        isHover && 'scale-105',
                    )}
                    src={wish.picture}
                    alt="Wish picture"
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 200px, (max-width: 1024px) 200px"
                    fill
                />
            ) : (
                <Background isHover={isHover} text={wish.title} />
            )}

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-secondary" />

            <div className="absolute right-1 top-1 flex w-fit">
                <Badges wish={wish} />
            </div>

            <div className="z-0 flex flex-col p-4">
                <div className="flex flex-col justify-end gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                className="object-cover"
                                src={
                                    wish.owner.picture ?? 'avatar_not_found.png'
                                }
                                alt="@shadcn"
                            />
                            <AvatarFallback>Avatar</AvatarFallback>
                        </Avatar>
                        <Typography variant="lead">
                            {wish.owner.name} {wish.owner.surname}
                        </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" className="truncate text-left">
                            {wish.title}
                        </Typography>
                        <Typography variant="h6" className="truncate">
                            {wish.price} $
                        </Typography>
                    </div>
                </div>

                <div className="flex w-full items-center justify-between gap-2">
                    <Typography
                        variant="paragraph"
                        className="truncate text-left"
                    >
                        {wish.description}
                    </Typography>
                    <Typography variant="small" className="w-fit text-end">
                        {splitted.join('.')}
                    </Typography>
                </div>
            </div>
        </MotionRatio>
    );
};
