export interface FitnessPlan {
    id: number;
    title: string;
    description: string;
    type: string;
}

export interface User {
    id: number;
    username: string;
    role: 'user' | 'coach';
}

export interface LoginResponse {
    message: string;
    user: {
        id: number;
        username: string;
        role: 'user' | 'coach';
    };
}