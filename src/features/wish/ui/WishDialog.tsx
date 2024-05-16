import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/dialog';
import { WishForm } from './WishForm';

export const WishDialog = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button className="w-full" variant="outline">
                    + Make a wish
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Make new wish</DialogTitle>
                </DialogHeader>
                <WishForm onCancel={() => {}} />
            </DialogContent>
        </Dialog>
    );
};
