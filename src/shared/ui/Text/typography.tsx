import { ReactNode } from 'react';
import { Label } from '../label';

interface Props {
    children: ReactNode;
}

export const Typography = ({ children }: Props) => {
    return <Label>{children}</Label>;
};
