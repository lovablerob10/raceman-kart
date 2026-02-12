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
    category: 'Ouro' | 'Prata' | 'PRO' | 'LIGHT';
    number: number | null;
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
    track_length?: string;
    track_corners?: number;
    track_record?: string;
    track_description?: string;
    track_id?: string;
    period?: string;
}

export interface News {
    id: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    image_url: string | null;
    author: string;
    published_at: string;
    status: 'draft' | 'published';
    meta_title?: string;
    meta_description?: string;
    slug?: string;
}

export interface Standing {
    id: string;
    pilot_id: string;
    category: 'Ouro' | 'Prata' | 'PRO' | 'LIGHT';
    points: number;
    position: number | null;
    season_year: number;
    created_at: string;
    pilot?: Pilot;
}
