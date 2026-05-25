import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const RAW_USERS_ENDPOINT = process.env.NEXT_PUBLIC_USERS_ENDPOINT;

if (!RAW_USERS_ENDPOINT) {
    throw new Error('NEXT_PUBLIC_USERS_ENDPOINT is not set');
}

const USERS_ENDPOINT = RAW_USERS_ENDPOINT!;

const handler = async (req: NextRequest) => {
    const body = (await req.json()) as {
        username: string;
        email: string;
        password: string;
    };

    if (!body.username || !body.password) {
        return new Response(
            JSON.stringify({ message: 'No credentials provided' }),
            { status: 400 },
        );
    }

    const response = await fetch(USERS_ENDPOINT + '/login', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (response.status !== 200) {
        const err = (await response.json()) as { message: string };
        console.log(response);

        return new Response(JSON.stringify({ message: err.message }), {
            status: 400,
        });
    }

    const cookieHeaders = response.headers.getSetCookie();

    if (!cookieHeaders) {
        return new Response(JSON.stringify({ message: 'No cookies found' }), {
            status: 400,
        });
    }

    const refreshToken = cookieHeaders.find(cookie =>
        cookie.includes('refreshToken='),
    );

    if (!refreshToken) {
        return NextResponse.json(
            { message: 'No refresh token found' },
            { status: 401 },
        );
    }

    const refreshTokenValue = refreshToken.split('=')[1]!;

    const cookiesStore = await cookies();

    const expires = new Date();

    expires.setDate(expires.getDate() + 30);

    cookiesStore.set('refreshToken', refreshTokenValue, {
        path: '/',
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        expires,
    });

    cookiesStore.set('username', body.username, {
        path: '/',
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        expires,
    });

    const parsedBody = (await response.json()) as { accessToken: string };

    return new Response(
        JSON.stringify({
            accessToken: parsedBody.accessToken,
        }),
        {
            status: 200,
        },
    );
};

export { handler as POST };
