import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

// Dummy NAMESPACE
const NAMESPACE_UUID = '1b671a64-40d5-491e-99b0-da01ff1f3341';

// Generate a version 5 UUID based on a name and the namespace UUID
export const generateUUIDFromName = (name: string): string => {
    return uuidv5(name, NAMESPACE_UUID);
}

export const generateUUID = () => {
    return uuidv4()
}