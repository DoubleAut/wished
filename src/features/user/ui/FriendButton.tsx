'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { revalidateTagFromServer } from '@/shared/api/Fetch/revalidateTag';
import { FRIENDS_TAG, USERS_TAG } from '@/shared/lib/constants/FetchTags';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { addFriend, removeFriend } from '../api/friendActions';

interface Props {
    friendId: string;
    onAction?: () => void;
}

export const FriendButton = ({ friendId, onAction }: Props) => {
    const viewer = useViewerStore(state => state.user);
    const followings = useViewerStore(state => state.followings);
    const setFollowings = useViewerStore(state => state.setFollowings);
    const [isProcessing, setIsProcessing] = useState(false);

    // Check if the friend is in the followings list
    const isIncluded = followings.some(user => user.id === friendId);

    const onFollow = useCallback(() => {
        if (!viewer || isProcessing) {
            return;
        }

        setIsProcessing(true);

        addFriend(viewer.id, friendId)
            .then(updatedUser => {
                setFollowings(updatedUser.followings);

                revalidateTagFromServer(USERS_TAG);
                revalidateTagFromServer(FRIENDS_TAG);

                toast.success('Successfully followed user');
            })
            .catch(error => {
                const errorMsg = error?.message ?? '';

                // If friendship already exists, treat it as success and update local state
                if (errorMsg.includes('Friendship already exist')) {
                    toast.success('Already following this user');
                } else {
                    toast.error(
                        errorMsg || 'Error occurred while following the user',
                    );
                }
            })
            .finally(() => {
                setIsProcessing(false);

                if (onAction) {
                    onAction();
                }
            });
    }, [viewer, friendId, isProcessing, setFollowings, onAction]);

    const onUnfollow = useCallback(() => {
        if (!viewer || isProcessing) {
            return;
        }

        setIsProcessing(true);

        removeFriend(viewer.id, friendId)
            .then(updatedUser => {
                setFollowings(updatedUser.followings);

                if (onAction) {
                    onAction();
                }

                revalidateTagFromServer(USERS_TAG);
                revalidateTagFromServer(FRIENDS_TAG);

                toast.success('Successfully unfollowed user');
            })
            .catch(error => {
                toast.error(
                    error?.message ??
                        'Error occurred while unfollowing the user',
                );
            })
            .finally(() => {
                setIsProcessing(false);
            });
    }, [viewer, friendId, isProcessing, setFollowings, onAction]);

    if (!viewer) {
        return (
            <Button asChild>
                <Skeleton className="h-full w-full" />
            </Button>
        );
    }

    return (
        <Button
            variant={isIncluded ? 'outline' : 'default'}
            size="sm"
            onClick={isIncluded ? onUnfollow : onFollow}
            disabled={isProcessing}
            className={`
                relative min-w-[80px] overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium
                transition-all duration-200
                ${
                    isIncluded
                        ? 'border-border text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive'
                        : 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm'
                }
            `}
        >
            <AnimatePresence mode="wait">
                {isProcessing ? (
                    <motion.span
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-center"
                    >
                        <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    </motion.span>
                ) : (
                    <motion.span
                        key={isIncluded ? 'unfollow' : 'follow'}
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -4 }}
                        transition={{
                            duration: 0.18,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    >
                        {isIncluded ? 'Unfollow' : 'Follow'}
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
};
