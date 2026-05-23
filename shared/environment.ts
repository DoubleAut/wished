const ENVIRONMENT_VARIABLES = {
    COGNITO_REGION: process.env.COGNITO_REGION,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
};

console.log('ENVIRONMENT_VARIABLES', ENVIRONMENT_VARIABLES);

if (!Object.values(ENVIRONMENT_VARIABLES).every(Boolean)) {
    throw new Error('One or more environment variables are not set');
}

export const ENVIRONMENT = ENVIRONMENT_VARIABLES;
