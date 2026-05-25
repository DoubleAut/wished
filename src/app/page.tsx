'use client';

import { useViewerStore } from '@/app/providers/ViewerProvider';
import { Skeleton } from '@/shared/ui/skeleton';
import { WishesTabs } from '@/widgets/wishes/ui/WishesTabs';
import { motion } from 'framer-motion';

const HomeSkeleton = () => (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
        </div>
    </div>
);

const Home = () => {
    const user = useViewerStore(state => state.user);

    if (!user) {
        return <HomeSkeleton />;
    }

    const firstName = user.name ?? 'there';

    return (
        <motion.div
            className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-2 sm:px-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="flex flex-col gap-1">
                <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                    Hey, {firstName} ✨
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    What are you wishing for today?
                </p>
            </div>

            <WishesTabs />
        </motion.div>
    );
};

export default Home;
