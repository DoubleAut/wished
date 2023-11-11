import { ReactNode } from 'react';
import { Label } from '../label';

interface Props {
    children: ReactNode;
}

export const Header = ({ children }: Props) => {
    return (
        <Label className="text-2xl font-semibold leading-none tracking-tight">
            {children}
        </Label>
    );
};
