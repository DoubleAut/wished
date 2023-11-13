'use client';

import { Label } from '@/shared/ui/label';
import { ReactNode } from 'react';

interface Props {
    header: ReactNode;
    form: ReactNode;
    providers: ReactNode;
    question: ReactNode;
}

const Separator = () => (
    <div className="flex gap-2">
        <div className="relative flex w-full items-center">
            <span className="h-[1px] w-full bg-slate-300" />
        </div>
        <div className="relative w-5">
            <Label className="w-full text-center text-sm text-slate-300">
                OR
            </Label>
        </div>
        <div className="relative flex w-full items-center">
            <span className="h-[1px] w-full bg-slate-300" />
        </div>
    </div>
);

export const Card = (props: Props) => {
    const { header, form, providers, question } = props;

    return (
        <div className="flex w-[400px] flex-col gap-3 rounded border p-6">
            {header}
            {form}
            <Separator />
            {providers}
            {question}
        </div>
    );
};
