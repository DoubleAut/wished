'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { revalidateTagFromServer } from '@/shared/api/Fetch/revalidateTag';
import { FRIENDS_TAG, USERS_TAG } from '@/shared/lib/constants/FetchTags';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { motion } from 'framer-motion';
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

    // If followings list is empty but we know we follow someone, we need to handle this
    // The backend will tell us if friendship already exists

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
                    // Add the friend to followings list optimistically
                    // We need to fetch the user data to add them
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
                relative overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium
                transition-all duration-200
                ${
                    isIncluded
                        ? 'border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive'
                        : 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm'
                }
            `}
        >
            <div className="inline-block overflow-hidden">
                <motion.span
                    className="flex flex-col"
                    animate={{ y: isIncluded ? 0 : -22 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <span>Unfollow</span>
                    <span>Follow</span>
                </motion.span>
            </div>
        </Button>
    );
};
