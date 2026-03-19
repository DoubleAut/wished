const RAW_USERS_ENDPOINT = process.env.NEXT_PUBLIC_USERS_ENDPOINT;

if (!RAW_USERS_ENDPOINT) {
    throw new Error('USERS_ENDPOINT is not set');
}

export const USERS_ENDPOINT = RAW_USERS_ENDPOINT!;
