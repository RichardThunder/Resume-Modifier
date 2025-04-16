/**
 * Checks if running in a browser environment.
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Gets the JWT token from local storage.
 * Returns null if not in a browser environment or token doesn't exist.
 */
export const getToken = (): string | null => {
    if (!isBrowser) {
        return null;
    }
    return localStorage.getItem("jwt_token");
};

/**
 * Sets the JWT token in local storage.
 * Does nothing if not in a browser environment.
 * @param token The JWT token string.
 */
export const setToken = (token: string): void => {
    if (!isBrowser) {
        return;
    }
    localStorage.setItem("jwt_token", token);
};

/**
 * Removes the JWT token from local storage.
 * Does nothing if not in a browser environment.
 */
export const removeToken = (): void => {
    if (!isBrowser) {
        return;
    }
    if (getToken()) { // Check if token exists before removing
        localStorage.removeItem("jwt_token");
    }
};

/**
 * Checks if the user is authenticated (i.e., a token exists).
 * Returns false if not in a browser environment.
 */
export const isAuthenticated = (): boolean => {
    if (!isBrowser) {
        return false;
    }
    return true;
};

/**
 * Gets an arbitrary item from local storage.
 * Returns null if not in a browser environment or the item doesn't exist.
 * @param item The key of the item to retrieve.
 */
export const getLocalStorage = (item: string): string | null => {
    if (!isBrowser) {
        return null;
    }
    return localStorage.getItem(item);
};

/**
 * Sets an arbitrary item in local storage.
 * Does nothing if not in a browser environment.
 * @param key The key of the item to set.
 * @param value The value to store.
 */
export const setLocalStorage = (key: string, value: string): void => {
    if (!isBrowser) {
        return;
    }
    localStorage.setItem(key, value);
};

/**
 * Removes an arbitrary item from local storage.
 * Does nothing if not in a browser environment.
 * @param key The key of the item to remove.
 */
export const removeLocalStorage = (key: string): void => {
    if (!isBrowser) {
        return;
    }
    localStorage.removeItem(key);
};