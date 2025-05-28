

export interface Club {
    id: number;
    name: string;
    description?: string;
    image?: string;
    address?: string;
    phone?: string;
    email: string;
    website?: string;
    active?: boolean;
}

export interface CreateClub {
    name: string;
    description?: string;
    image?: string;
    address?: string;
    phone?: string;
    email: string;
    website?: string;
    active?: boolean;
}

export interface ClubResponse {
    status: number;
    message: string;
    data?: Club;
    error?: string;
}

