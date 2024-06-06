'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { Typography } from '@/shared/ui/Text/typography';
import { DashboardInfoCard } from '@/shared/ui/dashboard-info-card';
import { WishesTabs } from '@/widgets/wishes/ui/WishesTabs';
import { RiGiftLine, RiUserLine } from '@remixicon/react';
import { motion } from 'framer-motion';

const Home = () => {
    const user = useViewerStore(state => state.user);
    const wishes = useViewerStore(state => state.wishes);
    const reservations = useViewerStore(state => state.reservations);
    const gifted = useViewerStore(state => state.gifted);
    const completed = useViewerStore(state => state.completed);

    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <motion.div className="container flex flex-col gap-2">
            <div className="flex items-center capitalize">
                <Typography variant="h3">My wishes</Typography>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <DashboardInfoCard
                    title="Wishes"
                    amount={wishes.length}
                    icon={<RiGiftLine className="h-4 w-4" />}
                />
                <DashboardInfoCard
                    title="Reservations"
                    amount={reservations.length}
                    icon={<RiGiftLine className="h-4 w-4" />}
                />
                <DashboardInfoCard
                    title="Gifted"
                    amount={gifted.length}
                    icon={<RiGiftLine className="h-4 w-4" />}
                />
                <DashboardInfoCard
                    title="Archived"
                    amount={completed.length}
                    icon={<RiUserLine className="h-4 w-4" />}
                />
            </div>
            <div className="flex items-center space-x-4 uppercase">
                <WishesTabs />
            </div>
        </motion.div>
    );
};

export default Home;
