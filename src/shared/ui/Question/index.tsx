import { Label } from '../label';

interface Props {
    text: string;
    type: string;
    url: string;
}

export const Question = ({ text, type, url }: Props) => {
    return (
        <Label className="text-center">
            {text}{' '}
            <a className="underline" href={url}>
                {type}
            </a>
        </Label>
    );
};
