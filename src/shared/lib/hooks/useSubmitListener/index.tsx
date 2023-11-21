import { useEffect } from 'react';

export const useSubmitListener = (callback: (...args: any) => void) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isEnter = event.code === 'Enter';
            const isNumpadEnter = event.code === 'NumpadEnter';

            if (isEnter || isNumpadEnter) {
                callback();

                return;
            }

            return;
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    });
};
