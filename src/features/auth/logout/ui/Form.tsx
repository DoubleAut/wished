'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { removeAccessToken } from '@/shared/api/Fetch/accessToken';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { RiLogoutBoxLine } from '@remixicon/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { logout } from '../lib';

export const Form = () => {
    const [isLoading, setLoading] = useState(false);
    const setUser = useViewerStore(state => state.setUser);
    const searchParams = useSearchParams();
    const router = useRouter();

    const onClick = () => {
        setLoading(true);

        logout();
        removeAccessToken();
        setUser(null);

        setLoading(false);

        router.push(searchParams.get('returnUrl') ?? '/');
    };

    return (
        <div className="flex h-[100dvh] items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="space-y-6 p-6 text-center">
                    <RiLogoutBoxLine className="mx-auto h-12 w-12 text-red-500" />
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Logout</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Are you sure you want to logout?
                        </p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push(
                                    searchParams.get('returnUrl') ?? '/',
                                )
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isLoading}
                            onClick={onClick}
                        >
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
