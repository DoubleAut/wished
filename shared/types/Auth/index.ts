type Error = {
    isError: boolean;
    messages: string[];
};

export type Inputs = {
    email: string;
    password: string;
    passwordRepeat?: string;
};

export type Errors = {
    email: Error;
    password: Error;
    passwordRepeat?: Error;
};
