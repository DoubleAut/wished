import { ReactNode } from 'react';
import { Typography } from './Text/typography';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface Props {
    title: string;
    amount: number;
    icon: ReactNode;
}

export const DashboardInfoCard = ({ title, amount, icon }: Props) => {
    return (
        <Card>
            <CardHeader className="flex w-full flex-row items-center justify-between">
                <CardTitle className="text-base font-normal">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <Typography variant="h3">{amount}</Typography>
            </CardContent>
        </Card>
    );
};
