import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Plus, Trash2, Save, X, Upload, ExternalLink,
    Star, Loader2, Search, Image as ImageIcon
} from 'lucide-react';

interface Sponsor {
    id: string;
    name: string;
    logo_url: string | null;
    website_url: string | null;
    tier: 'premium' | 'standard';
    is_active: boolean;
    sort_order: number;
}

export function Sponsors() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formName, setFormName] = useState('');
    const [formWebsite, setFormWebsite] = useState('');
    const [formTier, setFormTier] = useState<'premium' | 'standard'>('standard');
    const [formActive, setFormActive] = useState(true);
    const [formLogoUrl, setFormLogoUrl] = useState<string | null>(null);
    const [formLogoFile, setFormLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        const { data, error } = await supabase
            .from('sponsors')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching sponsors:', error);
        } else {
            setSponsors(data || []);
        }
        setLoading(false);
    };

    const uploadLogo = async (file: File): Promise<string | null> => {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `logos/${fileName}`;

        const { error } = await supabase.storage
            .from('sponsors')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from('sponsors')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas imagens.');
            return;
        }

        setFormLogoFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormName('');
        setFormWebsite('');
        setFormTier('standard');
        setFormActive(true);
        setFormLogoUrl(null);
        setFormLogoFile(null);
        setLogoPreview(null);
        setEditingSponsor(null);
        setShowForm(false);
    };

    const openEditForm = (sponsor: Sponsor) => {
        setEditingSponsor(sponsor);
        setFormName(sponsor.name);
        setFormWebsite(sponsor.website_url || '');
        setFormTier(sponsor.tier);
        setFormActive(sponsor.is_active);
        setFormLogoUrl(sponsor.logo_url);
        setLogoPreview(sponsor.logo_url);
        setFormLogoFile(null);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!formName.trim()) return;
        setSaving(true);

        let logoUrl = formLogoUrl;

        // Upload new logo if selected
        if (formLogoFile) {
            setUploading(true);
            const url = await uploadLogo(formLogoFile);
            if (url) logoUrl = url;
            setUploading(false);
        }

        const sponsorData = {
            name: formName.trim(),
            logo_url: logoUrl,
            website_url: formWebsite.trim() || null,
            tier: formTier,
            is_active: formActive,
        };

        if (editingSponsor) {
            // Update
            const { error } = await supabase
                .from('sponsors')
                .update({ ...sponsorData, updated_at: new Date().toISOString() })
                .eq('id', editingSponsor.id);

            if (error) console.error('Update error:', error);
        } else {
            // Insert
            const maxOrder = sponsors.length > 0
                ? Math.max(...sponsors.map(s => s.sort_order)) + 1
                : 0;

            const { error } = await supabase
                .from('sponsors')
                .insert({ ...sponsorData, sort_order: maxOrder });

            if (error) console.error('Insert error:', error);
        }

        await fetchSponsors();
        resetForm();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este patrocinador?')) return;

        const { error } = await supabase
            .from('sponsors')
            .delete()
            .eq('id', id);

        if (error) console.error('Delete error:', error);
        else setSponsors(prev => prev.filter(s => s.id !== id));
    };

    const toggleActive = async (sponsor: Sponsor) => {
        const { error } = await supabase
            .from('sponsors')
            .update({ is_active: !sponsor.is_active, updated_at: new Date().toISOString() })
            .eq('id', sponsor.id);

        if (!error) {
            setSponsors(prev =>
                prev.map(s => s.id === sponsor.id ? { ...s, is_active: !s.is_active } : s)
            );
        }
    };

    const filteredSponsors = sponsors.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#2E6A9C]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Teko, sans-serif' }}>
                        Patrocinadores
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Gerencie os logos que aparecem na seção de patrocinadores do site
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2E6A9C] text-white rounded-xl hover:bg-[#245580] transition-all font-bold shadow-lg"
                >
                    <Plus size={18} />
                    Novo Patrocinador
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar patrocinador..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C] transition-colors"
                />
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {editingSponsor ? 'Editar Patrocinador' : 'Novo Patrocinador'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Logo do Patrocinador</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2E6A9C] hover:bg-blue-50/30 transition-all flex items-center justify-center overflow-hidden group"
                                >
                                    {logoPreview ? (
                                        <>
                                            <img
                                                src={logoPreview}
                                                alt="Preview"
                                                className="max-h-full max-w-full object-contain p-4"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">Trocar imagem</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Upload size={32} />
                                            <span className="text-sm">Clique para enviar o logo</span>
                                            <span className="text-xs text-gray-300">PNG, JPG, WebP ou SVG (máx 5MB)</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Ex: Red Bull Racing"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C]"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={formWebsite}
                                    onChange={(e) => setFormWebsite(e.target.value)}
                                    placeholder="https://www.exemplo.com"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C]"
                                />
                            </div>

                            {/* Tier */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Nível</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFormTier('premium')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${formTier === 'premium'
                                            ? 'border-[#F5B500] bg-[#F5B500]/10 text-[#F5B500]'
                                            : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                            }`}
                                    >
                                        <Star size={16} className={formTier === 'premium' ? 'fill-[#F5B500]' : ''} />
                                        Premium
                                    </button>
                                    <button
                                        onClick={() => setFormTier('standard')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${formTier === 'standard'
                                            ? 'border-[#2E6A9C] bg-[#2E6A9C]/10 text-[#2E6A9C]'
                                            : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                            }`}
                                    >
                                        Standard
                                    </button>
                                </div>
                            </div>

                            {/* Active */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFormActive(!formActive)}
                                    className={`w-12 h-6 rounded-full transition-all ${formActive ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formActive ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                </button>
                                <span className="text-sm text-gray-600">
                                    {formActive ? 'Visível no site' : 'Oculto do site'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={resetForm}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !formName.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2E6A9C] text-white rounded-xl hover:bg-[#245580] transition-all font-bold disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        {uploading ? 'Enviando logo...' : 'Salvando...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Salvar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sponsors Grid */}
            {filteredSponsors.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-semibold mb-2">Nenhum patrocinador cadastrado</p>
                    <p className="text-gray-400 text-sm">Adicione o primeiro patrocinador clicando no botão acima.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSponsors.map((sponsor) => (
                        <div
                            key={sponsor.id}
                            className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg group ${sponsor.is_active ? 'border-gray-100' : 'border-red-200 opacity-60'
                                }`}
                        >
                            {/* Logo Area */}
                            <div className="h-32 bg-gray-50 flex items-center justify-center p-4 relative">
                                {sponsor.logo_url ? (
                                    <img
                                        src={sponsor.logo_url}
                                        alt={sponsor.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-1">
                                        <ImageIcon size={36} />
                                        <span className="text-xs">Sem logo</span>
                                    </div>
                                )}

                                {/* Tier Badge */}
                                {sponsor.tier === 'premium' && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-[#F5B500] text-black text-[10px] font-black rounded-full uppercase">
                                        <Star size={10} className="fill-black" />
                                        Premium
                                    </div>
                                )}

                                {/* Active Indicator */}
                                {!sponsor.is_active && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase">
                                        Inativo
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Teko, sans-serif' }}>
                                        {sponsor.name}
                                    </h4>
                                    {sponsor.website_url && (
                                        <a
                                            href={sponsor.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-[#2E6A9C]"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => openEditForm(sponsor)}
                                        className="flex-1 text-sm text-center py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => toggleActive(sponsor)}
                                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${sponsor.is_active
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                                            }`}
                                    >
                                        {sponsor.is_active ? 'Ativo' : 'Inativo'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sponsor.id)}
                                        className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Sponsors;
