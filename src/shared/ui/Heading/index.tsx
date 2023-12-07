import { Header } from '../Text/header';
import { Subheader } from '../Text/subheader';

interface Props {
    header: string;
    subheader: string;
}

export const Heading = ({ header, subheader }: Props) => {
    return (
        <div className="flex flex-col gap-3">
            <Header>{header}</Header>
            <Subheader>{subheader}</Subheader>
        </div>
    );
};
