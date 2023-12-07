import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '../[...nextauth]/services/user';

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

const handler = async (req: Request) => {
    try {
        const request = await req.json();
        const isUserExist = await getUserByEmail(request.email);

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

        const user = await createUser({
            email: request.email,
            password: request.password,
        });

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
