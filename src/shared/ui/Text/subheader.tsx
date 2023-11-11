import { ReactNode } from 'react';
import { Label } from '../label';

interface Props {
    children: ReactNode;
}

export const Subheader = ({ children }: Props) => {
    return (
        <Label className="text-sm text-muted-foreground text-slate-500">
            {children}
        </Label>
    );
};
