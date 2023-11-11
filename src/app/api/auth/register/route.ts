import { NextResponse } from 'next/server';

type Credentials = Record<'email' | 'password', string> | undefined;
type Data = Credentials & { passwordRepeat: string };
type User = Credentials & { id: number };

const errorSkeleton = {
    email: {
        isError: false,
        messages: [],
    },
    password: {
        isError: false,
        messages: [],
    },
    passwordRepeat: {
        isError: false,
        messages: [],
    },
};

const fetchUsers = async (url: string) => {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
        throw new Error('Error during getting users');
    }

    const result: User[] = await response.json();

    return result;
};

const getUser = async (email: string) => {
    const users: User[] = await fetchUsers('http://localhost:5000/users');
    const user = users.find(user => user.email === email);

    return user;
};

const createUser = async (credentials: Data) => {
    const { email, password } = credentials;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    };

    const response = await fetch('http://localhost:5000/users', options);
    const user: User = await response.json();

    return user;
};

const isUserExists = async (email: string) => {
    const user = await getUser(email);

    return !!user;
};

const handler = async (req: Request) => {
    try {
        const request: Data = await req.json();
        const isUserExist = await isUserExists(request.email);

        if (isUserExist) {
            const body = JSON.stringify({
                ...errorSkeleton,
                email: {
                    isError: true,
                    messages: ['Email already exist'],
                },
            });

            return new NextResponse(body, { status: 400 });
        }

        const user = await createUser(request);

        return new NextResponse(JSON.stringify(user), { status: 201 });
    } catch (e) {
        const body = JSON.stringify({
            ...errorSkeleton,
            email: {
                isError: true,
                messages: ['Backend returned error message. Try again later!'],
            },
        });

        return new NextResponse(body, { status: 500 });
    }
};

export { handler as POST };
