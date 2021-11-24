export interface ActionsProps {
    checked: { [k: string]: boolean };
    title: string;
    handleDestroy: () => void;
}