import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, ExternalLink, Heart, MessageCircle, Play, Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- CONFIGURATION ---
// 1. Go to https://behold.so/ and connect your Instagram @racemankart
// 2. Create a "JSON Feed"
// 3. Paste the provided URL here:
const BEHOLD_API_URL = 'https://feeds.behold.so/7q3yxaRt6Jy5abAhKSfZ';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/racemankart/';

interface InstagramPost {
    id: string;
    mediaUrl: string;
    thumbnailUrl?: string; // Add this for videos
    permalink: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    caption?: string;
    likeCount?: number;
    commentCount?: number;
    timestamp: string;
}

export function InstagramFeed() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!BEHOLD_API_URL) {
                // Fallback or demo mode if URL is missing
                console.warn('Behold API URL missing in InstagramFeed.tsx');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(BEHOLD_API_URL);
                const data = await response.json();
                // Behold returns an array or an object with a 'posts' key depending on version
                const items = Array.isArray(data) ? data : data.posts || [];
                setPosts(items.slice(0, 6)); // Exactly 6 posts
            } catch (error) {
                console.error('Error fetching Instagram posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (isLoading || posts.length === 0) return;

        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Title animation
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        once: true
                    }
                }
            );

            // Grid items stagger
            const items = gridRef.current?.querySelectorAll('.insta-item');
            if (items) {
                gsap.fromTo(
                    items,
                    { opacity: 0, scale: 0.9, y: 40 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'back.out(1.2)',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }
        }, section);

        return () => ctx.revert();
    }, [isLoading, posts]);

    return (
        <section
            ref={sectionRef}
            id="instagram-feed"
            className="py-24 bg-black relative overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E6A9C]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5B500]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="inline-flex items-center gap-3 bg-[#F5B500]/10 border border-[#F5B500]/20 px-4 py-2 rounded-full mb-6">
                        <Instagram size={18} className="text-[#F5B500]" />
                        <span className="text-[#F5B500] text-sm font-black uppercase tracking-[0.2em]">@racemankart</span>
                    </div>

                    <h2
                        ref={titleRef}
                        className="text-5xl md:text-7xl font-display font-black text-white uppercase italic leading-none tracking-tighter"
                        style={{ fontFamily: 'Teko, sans-serif' }}
                    >
                        SINTA O <span className="text-[#F5B500]">PADDOCK</span>
                    </h2>
                    <p className="text-gray-400 mt-4 text-xl font-medium uppercase italic max-w-xl" style={{ fontFamily: 'Teko, sans-serif' }}>
                        Acompanhe os bastidores, reels e a adrenalina de cada etapa diretamente no nosso Instagram.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={48} className="text-[#F5B500] animate-spin" />
                        <p className="text-[#F5B500] font-black italic uppercase tracking-widest" style={{ fontFamily: 'Teko, sans-serif' }}>Carregando Feed...</p>
                    </div>
                )}

                {/* Instructions State (Only shows if no URL and not loading) */}
                {!isLoading && !BEHOLD_API_URL && (
                    <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-12 text-center max-w-2xl mx-auto mb-16">
                        <p className="text-white text-xl font-bold mb-4">Pronto para Conectar!</p>
                        <p className="text-white/60 mb-8">
                            O template premium está pronto. Para exibir as fotos reais do @racemankart, cole o link do seu
                            <strong> Behold.so JSON Feed</strong> no arquivo <code className="text-[#F5B500]">InstagramFeed.tsx</code>.
                        </p>
                    </div>
                )}

                {/* Uniform Portrait Grid - 6 Posts Max */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20"
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => window.open(post.permalink, '_blank')}
                            role="button"
                            tabIndex={0}
                            className="insta-item group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 cursor-pointer shadow-2xl transition-all duration-500 hover:border-[#F5B500]/50 aspect-[9/16]"
                        >
                            {/* Scanline Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                            {/* Vignette */}
                            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)] opacity-60" />

                            {/* Post Media */}
                            <img
                                src={post.mediaType === 'VIDEO' ? (post.thumbnailUrl || post.mediaUrl) : post.mediaUrl}
                                alt={post.caption || 'Instagram post'}
                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1530648672449-81f6c723e2c1?q=80&w=800&auto=format&fit=crop';
                                }}
                            />

                            {/* Content Info (Hover) */}
                            <div className="absolute inset-0 z-30 flex flex-col justify-end p-4 md:p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black via-black/40 to-transparent">

                                {post.caption && (
                                    <p className="text-white text-xs md:text-sm font-medium line-clamp-2 mb-4 leading-relaxed font-technical" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                        {post.caption}
                                    </p>
                                )}

                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-white">
                                            <Heart size={16} className={`text-[#F5B500] ${post.likeCount ? 'fill-[#F5B500]' : ''}`} />
                                            {post.likeCount && (
                                                <span className="text-sm font-bold font-mono">{post.likeCount}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white">
                                            <MessageCircle size={16} className="text-white/70" />
                                            {post.commentCount && (
                                                <span className="text-sm font-bold font-mono">{post.commentCount}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-[#F5B500] px-3 py-1.5 rounded-lg group/btn">
                                        <span className="text-[10px] font-black text-black uppercase tracking-tighter">VER POST</span>
                                        <Instagram size={14} className="text-black" />
                                    </div>
                                </div>
                            </div>

                            {/* Video Badge */}
                            {(post.mediaType === 'VIDEO' || post.permalink.includes('/reels/')) && (
                                <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
                                    <Play size={14} className="text-white fill-white" />
                                </div>
                            )}

                            {/* Racing Corner Detail */}
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#F5B500] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#F5B500] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="flex justify-center">
                    <div
                        onClick={() => window.open(INSTAGRAM_PROFILE_URL, '_blank')}
                        role="button"
                        className="group relative flex items-center gap-6 overflow-hidden bg-transparent border-2 border-white/10 px-12 py-5 rounded-full hover:border-[#F5B500] transition-all duration-500 cursor-pointer"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F5B500]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <span className="relative z-10 text-white group-hover:text-[#F5B500] font-display font-black uppercase text-2xl italic tracking-widest transition-colors duration-500" style={{ fontFamily: 'Teko, sans-serif' }}>
                            @{INSTAGRAM_PROFILE_URL.split('/').filter(Boolean).pop()} NO INSTAGRAM
                        </span>

                        <div className="relative z-10 bg-white/5 group-hover:bg-[#F5B500] p-2 rounded-full transition-all duration-500">
                            <ExternalLink size={20} className="text-white group-hover:text-black" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default InstagramFeed;
