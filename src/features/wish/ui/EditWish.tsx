import { Button } from '@/shared/ui/button';
import { useStore } from 'zustand';
import { dialogStore } from '../model/dialogView';

export const EditWish = () => {
    const store = useStore(dialogStore);
    const dialogWish = store.dialogWish;
    const setDialogWish = store.setDialogWish;

    const onClick = () => setDialogWish(dialogWish, 'edit');

    return (
        <Button variant="outline" onClick={onClick}>
            Edit
        </Button>
    );
};
