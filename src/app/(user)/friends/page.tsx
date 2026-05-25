'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { FriendsWidget } from '@/widgets/user/ui/Friends';
import { motion } from 'framer-motion';

const FriendsPageSkeleton = () => (
    <div className="mx-auto flex max-w-xl items-center justify-center px-4 py-6 sm:px-0">
        <div className="w-full space-y-5">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="bg-muted relative h-8 w-32 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="bg-muted relative h-4 w-48 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
            </div>

            {/* Tab skeleton */}
            <div className="bg-muted relative h-10 w-full overflow-hidden rounded-xl">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Search skeleton */}
            <div className="bg-muted relative h-10 w-full overflow-hidden rounded-xl">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Cards skeleton */}
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-muted relative h-16 w-full overflow-hidden rounded-xl"
                    >
                        <div
                            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                        />
                    </div>
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
