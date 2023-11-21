'use client';

import { Wrapper } from '@/shared/ui/Wrapper';
import { Button } from '@/shared/ui/button';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';

type Provider = Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
> | null;

export const Providers = ({ providers }: { providers: Provider }) => {
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
                            Sign in with {provider.name}
                        </Button>
                    ))}
        </Wrapper>
    );
};
