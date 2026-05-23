
export const getTypesafeBodyOrNull = <T>(body: string | null) => body ? JSON.parse(body) as T : null;