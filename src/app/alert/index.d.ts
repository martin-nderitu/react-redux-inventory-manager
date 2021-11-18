import {Message} from "../index";
import React from "react";

export interface AlertProps {
    message: Message | null;
    setMessage: React.Dispatch<React.SetStateAction<Message | null>>;
    timeout?: number;
}