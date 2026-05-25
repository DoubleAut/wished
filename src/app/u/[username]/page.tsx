import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{
        username: string;
    }>;
}

const UserRedirectPage = async ({ params: paramsPromise }: Props) => {
    const { username } = await paramsPromise;

    redirect(`/users/${username}`);
};

export default UserRedirectPage;
