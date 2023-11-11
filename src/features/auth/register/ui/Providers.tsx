'use client';

import { Wrapper } from '@/shared/ui/Wrapper';
import { Button } from '@/shared/ui/button';
import { BuiltInProviderType } from 'next-auth/providers/index';
import {
    ClientSafeProvider,
    LiteralUnion,
    getProviders,
    signIn,
} from 'next-auth/react';
import { useState, useLayoutEffect } from 'react';

type Provider = Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
> | null;

export const Providers = () => {
    const [providers, setProviders] = useState<Provider>(null);

    useLayoutEffect(() => {
        const handleProviders = async () => {
            const providers = await getProviders();

            setProviders(providers);
        };

        handleProviders();
    }, []);

    return (
        <Wrapper>
            {providers &&
                Object.values(providers)
                    .filter(item => item.name !== 'Credentials')
                    .map(provider => (
                        <Button
                            key={provider.name}
                            className="w-full"
                            variant="outline"
                            onClick={() => signIn(provider.id)}
                        >
                            Sign up with {provider.name}
                        </Button>
                    ))}
        </Wrapper>
    );
};
