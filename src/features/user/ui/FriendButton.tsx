'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { addFriend, removeFriend } from '../api/friendActions';

export const FriendButton = ({ friendId }: { friendId: number }) => {
    const { user, ...store } = useViewerStore(state => state);
    const isIncluded = user?.followings.find(user => user.id === friendId);

    if (!user) {
        return null;
    }

    if (isIncluded) {
        return (
            <Button
                variant="outline"
                onClick={() =>
                    removeFriend(user.id, friendId)
                        .then(viewer => {
                            store.setFollowings(viewer.followings);

                            toast.success('Successfully unfollowed user');
                        })
                        .catch(() => {
                            toast.error(
                                'Error occured while unfollowing the user',
                            );
                        })
                }
            >
                Unfollow
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            onClick={() =>
                addFriend(user.id, friendId)
                    .then(viewer => {
                        store.setFollowings(viewer.followings);
                    })
                    .catch(() => {
                        toast.error('Error occured while following the user');
                    })
            }
        >
            Follow
        </Button>
    );
};
