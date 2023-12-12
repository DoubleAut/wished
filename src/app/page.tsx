'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
    const { data: session } = useSession();

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
