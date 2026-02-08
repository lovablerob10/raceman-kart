import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Pilot {
    id: string;
    name: string;
    category: 'PRO' | 'LIGHT';
    team: string | null;
    photo_url: string | null;
    created_at: string;
}

export interface Stage {
    id: string;
    stage_number: number;
    name: string;
    location: string;
    date: string;
    is_active: boolean;
    created_at: string;
}

export interface News {
    id: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    image_url: string | null;
    author: string;
    published_at: string;
}

export interface Standing {
    id: string;
    pilot_id: string;
    category: 'PRO' | 'LIGHT';
    points: number;
    position: number | null;
    season_year: number;
    created_at: string;
    pilot?: Pilot;
}
