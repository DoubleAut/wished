import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { useState } from 'react';
import { WishForm } from './WishForm';

export const WishDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Make a wish</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Make new wish</DialogTitle>
                </DialogHeader>
                <WishForm onCancel={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};
