'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function Home() {
    const { data: session } = useSession();
    const navigation = useRouter();

    useLayoutEffect(() => {
        // If session return refresh token error, then user will need to relogin!
        if (session?.error === 'RefreshAccessTokenError') {
            navigation.push(`/auth/error?error=Session expired`);
        }
    }, [session]);

    return (
        <>
            {session && (
                <>
                    Signed in as {session.user?.email} <br />
                    <button onClick={() => signOut()}>Sign out</button>
                </>
            )}
            {!session && (
                <>
                    Not signed in <br />
                    <button onClick={() => signIn()}>Sign in</button>
                </>
            )}

            <Link href="/profile">Profile!</Link>
        </>
    );
}
