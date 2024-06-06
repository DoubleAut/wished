'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { revalidateTagFromServer } from '@/shared/api/Fetch/revalidateTag';
import { FRIENDS_TAG, USERS_TAG } from '@/shared/lib/constants/FetchTags';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addFriend, removeFriend } from '../api/friendActions';

interface Props {
    friendId: number;
    onAction?: () => void;
}

export const FriendButton = ({ friendId, onAction }: Props) => {
    const router = useRouter();
    const viewer = useViewerStore(state => state.user);
    const followings = useViewerStore(state => state.followings);
    const setFollowings = useViewerStore(state => state.setFollowings);

    if (!viewer) {
        return (
            <Button asChild>
                <Skeleton className="h-full w-full" />
            </Button>
        );
    }

    const onFollow = () =>
        addFriend(viewer.id, friendId)
            .then(viewer => {
                setFollowings(viewer.followings);

                revalidateTagFromServer(USERS_TAG);
                revalidateTagFromServer(FRIENDS_TAG);

                toast.success('Successfully followed user');
            })
            .catch(e => {
                console.log(e);
                toast.error('Error occured while following the user');
            });

    const onUnfollow = () =>
        removeFriend(viewer.id, friendId)
            .then(viewer => {
                setFollowings(viewer.followings);

                if (onAction) {
                    onAction();
                }

                revalidateTagFromServer(USERS_TAG);
                revalidateTagFromServer(FRIENDS_TAG);

                toast.success('Successfully unfollowed user');
            })
            .catch(err => {
                console.log(err);
                toast.error('Error occured while unfollowing the user');
            });

    const isIncluded = followings.find(user => user.id === friendId);

    return (
        <Button variant="outline" onClick={isIncluded ? onUnfollow : onFollow}>
            <div className="inline-block h-full w-full overflow-hidden">
                <motion.p
                    animate={{
                        y: isIncluded ? '0%' : '-100%',
                    }}
                >
                    Unfollow
                </motion.p>
                <motion.p
                    animate={{
                        y: isIncluded ? '100%' : '-100%',
                    }}
                >
                    Follow
                </motion.p>
            </div>
        </Button>
    );
};
