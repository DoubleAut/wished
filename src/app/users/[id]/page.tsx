import { getUserById } from '@/entities/user/lib';
import { User } from '@/entities/user/ui/User';
import { Wishes } from '@/entities/user/ui/Wishes';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        id: number;
    };
}

export default async function Home({ params: { id } }: Props) {
    const user = await getUserById(id);

    if (!user) {
        redirect('/404');
    }

    const amounts = {
        wishes: user.wishes.length,
        friends: user.friends.length,
    };

    return (
        <div className="flex w-full flex-col items-center gap-3 p-3">
            <User
                header={`${user.name} ${user.surname}`}
                subheader={`${amounts.wishes} wishes | ${amounts.friends} friends`}
                picture={user.picture}
            />
            <Wishes subheader="Wishes" wishes={user.wishes} />
        </div>
    );
}
