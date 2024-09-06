import { USERS_ENDPOINT } from '@/features/auth/login/lib/api';
import { cookies } from 'next/headers';

const handler = async () => {
    const cookiesStore = cookies();

    const refreshToken = cookiesStore.get('refreshToken');
    const username = cookiesStore.get('username');

    console.log('Refresh token: ', refreshToken);
    console.log('Username: ', username);

    if (!refreshToken || !username) {
        return new Response(JSON.stringify({ message: 'No cookies found' }), {
            status: 400,
        });
    }

    const response = await fetch(USERS_ENDPOINT + '/rotate', {
        method: 'POST',
        credentials: 'include',
        headers: {
            Cookie: cookiesStore.toString(),
        },
    });

    if (response.status !== 200) {
        const err = (await response.json()) as { message: string };

        return new Response(
            JSON.stringify({
                message: err.message,
            }),
            {
                status: 400,
            },
        );
    }

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
