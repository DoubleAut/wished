'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { FriendsWidget } from '@/widgets/user/ui/Friends';
import { motion } from 'framer-motion';

const FriendsPageSkeleton = () => (
    <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-24">
        <div className="w-full space-y-4">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-16 w-full animate-pulse rounded-xl bg-muted"
                    />
                ))}
            </div>
        </div>
    </div>
);

export const FriendsPage = () => {
    const user = useViewerStore(state => state.user);
    const followers = useViewerStore(state => state.followers);
    const followings = useViewerStore(state => state.followings);

    if (!user) {
        return <FriendsPageSkeleton />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <FriendsWidget user={{ ...user, followers, followings }} />
        </motion.div>
    );
};

export default FriendsPage;
