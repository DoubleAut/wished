const allowOrigin = 'http://localhost:3000';
const allowHeaders = '*';

export const getErrorResponse = (
    code: number,
    message: string,
    methods = '*',
) => ({
    statusCode: code,
    headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': methods,
        'Access-Control-Allow-Headers': allowHeaders,
    },
    body: JSON.stringify({
        message,
    }),
});
