import { useViewerStore } from '@/core/providers/ViewerProvider';
import { WishDialog } from '@/entities/wish/ui/WishDialog';
import { WishForm } from '@/entities/wish/ui/WishForm';
import {
    ArchivedWishes,
    GiftedWishes,
    ReservedWishes,
    Wishes,
} from '@/entities/wish/ui/Wishes';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { RiBardLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

type TabsValues = 'wishes' | 'reservations' | 'gifted' | 'archived';

const MotionTabsContent = motion(TabsContent);

const Content = (props: { children: ReactNode; value: string }) => (
    <MotionTabsContent
        value={props.value}
        className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        forceMount={true}
        animate={{
            transition: {
                delayChildren: 0.1,
            },
        }}
    >
        {props.children}
    </MotionTabsContent>
);

export const WishesTabs = () => {
    const [state, setState] = useState<TabsValues>('wishes');
    const wishes = useViewerStore(state => state.wishes);
    const reservations = useViewerStore(state => state.reservations);
    const gifted = useViewerStore(state => state.gifted);
    const completed = useViewerStore(state => state.completed);

    const onChange = (value: string) => setState(value as TabsValues);

    return (
        <Tabs defaultValue="wishes" className="w-full" onValueChange={onChange}>
            <div className="flex w-full items-center justify-between">
                <TabsList className="w-fit">
                    <TabsTrigger value="wishes">Wishes</TabsTrigger>
                    <TabsTrigger value="reservations">Reservations</TabsTrigger>
                    <TabsTrigger value="gifted">Gifted</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
                <WishDialog
                    trigger={
                        <Button variant="outline">
                            <RiBardLine className="mr-3 h-4 w-4" />
                            Make a wish
                        </Button>
                    }
                    content={<WishForm onCancel={() => {}} />}
                    wish={null}
                    isButtonTrigger={true}
                    defaultMode={'edit'}
                />
            </div>
            {state === 'wishes' && (
                <Content value="wishes">
                    <Wishes wishes={wishes} />
                </Content>
            )}
            {state === 'reservations' && (
                <Content value="reservations">
                    <ReservedWishes wishes={reservations} />
                </Content>
            )}
            {state === 'gifted' && (
                <Content value="gifted">
                    <GiftedWishes wishes={gifted} />
                </Content>
            )}
            {state === 'archived' && (
                <Content value="archived">
                    <ArchivedWishes wishes={completed} />
                </Content>
            )}
        </Tabs>
    );
};
