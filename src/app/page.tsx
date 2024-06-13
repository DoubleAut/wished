'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { CategoryList } from '@/entities/category/ui/CategoryList';
import { Typography } from '@/shared/ui/Text/typography';
import { WishesTabs } from '@/widgets/wishes/ui/WishesTabs';
import { motion } from 'framer-motion';

const Home = () => {
    const user = useViewerStore(state => state.user);
    const categories = useViewerStore(state => state.categories);

    if (!user) {
        return <div>Loading</div>;
    }

    return (
        <motion.div className="container flex flex-col gap-2">
            <div className="flex items-center capitalize">
                <Typography variant="h3">My wishes</Typography>
            </div>
            <div className="rounded border p-2">
                <WishesTabs />
            </div>
            <div className="rounded border p-2">
                <CategoryList items={categories} />
            </div>
        </motion.div>
    );
};

export default Home;
