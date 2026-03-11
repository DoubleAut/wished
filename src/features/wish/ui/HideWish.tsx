import { useViewerStore } from '@/core/providers/ViewerProvider';
import { WISHES_TAG } from '@/shared/lib/constants/FetchTags';
import { queryClient } from '@/shared/lib/constants/Query/QueryClient';
import { Wish } from '@/shared/types/Wish';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from 'sonner';
import { useStore } from 'zustand';
import { updateWish } from '../lib';
import { dialogStore } from '../model/dialogView';

export const HideWish = () => {
    const updateViewerWish = useViewerStore(state => state.updateWish);
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setDialogWish = store.setDialogWish;

    const onClick = () => {
        if (!dialogWish) {
            return;
        }

        const wish = dialogWish as Wish;

        const isHidden = wish.isHidden;

        updateWish({ isHidden: !isHidden }, wish.id)
            .then(newWish => {
                setDialogWish(newWish, 'view');

                updateViewerWish(newWish);

                queryClient.invalidateQueries({ queryKey: [WISHES_TAG] });

                toast.success('The wish successfully updated');
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    if (!dialogWish) {
        return (
            <Button asChild>
                <Skeleton className="w-fit" />
            </Button>
        );
    }

    return (
        <Button variant="outline" onClick={onClick}>
            {dialogWish?.isHidden ? 'Reveal gift' : 'Hide gift'}
        </Button>
    );
};
