import { Button } from '../button';

interface Props {
    name: string;
    text: string;
    onClick: () => void;
}

export const Provider = ({ text, name, onClick }: Props) => {
    return (
        <Button className="w-full" variant="outline" onClick={onClick}>
            {text} {name}
        </Button>
    );
};
