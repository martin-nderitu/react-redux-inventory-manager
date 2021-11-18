import {Message} from "../index";

export interface CardProps {
    title: string;
    message?: Message | null | undefined;
    setMessage?: any;
    cardBody: JSX.Element;
    cardFooter?: JSX.Element;
}