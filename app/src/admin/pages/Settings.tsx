import { useState, useEffect } from 'react';
import { Save, Moon, Sun, Zap, ZapOff, Globe, Mail, Bell, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Settings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    darkMode: boolean;
    animationsEnabled: boolean;
    emailNotifications: boolean;
}

export function Settings() {
    const [settings, setSettings] = useState<Settings>({
        siteName: 'RKT Raceman Kart',
        siteDescription: 'O melhor campeonato de kart amador do interior paulista',
        contactEmail: 'contato@racemankart.com.br',
        darkMode: false,
        animationsEnabled: true,
        emailNotifications: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();

            if (error) throw error;

            if (data) {
                setSettings({
                    siteName: data.site_name,
                    siteDescription: data.site_description,
                    contactEmail: data.contact_email,
                    darkMode: data.dark_mode,
                    animationsEnabled: data.animations_enabled,
                    emailNotifications: data.email_notifications,
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: keyof Settings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                site_name: settings.siteName,
                site_description: settings.siteDescription,
                contact_email: settings.contactEmail,
                dark_mode: settings.darkMode,
                animations_enabled: settings.animationsEnabled,
                email_notifications: settings.emailNotifications,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('settings')
                .update(payload)
                .eq('id', (await supabase.from('settings').select('id').single()).data?.id);

            if (error) throw error;

            setHasChanges(false);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-[#2E6A9C] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-500">Configure as opções do site</p>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${hasChanges && !saving
                        ? 'bg-[#2E6A9C] text-white hover:bg-[#1e4669]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {saving ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Save size={20} />
                    )}
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </span>
                </button>
            </div>

            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3
                    className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    <Globe size={24} className="text-[#2E6A9C]" />
                    Configurações Gerais
                </h3>

                <div className="space-y-4">
                    {/* Site Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Site</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            value={settings.siteDescription}
                            onChange={(e) => handleChange('siteDescription', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C] resize-none"
                        />
                    </div>

                    {/* Contact Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                        />
                    </div>
                </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3
                    className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    <Sun size={24} className="text-[#F5B500]" />
                    Aparência
                </h3>

                <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            {settings.darkMode ? (
                                <Moon size={20} className="text-slate-600" />
                            ) : (
                                <Sun size={20} className="text-yellow-500" />
                            )}
                            <div>
                                <p className="font-medium text-slate-800">Modo Escuro</p>
                                <p className="text-sm text-gray-500">Ativa o tema escuro no dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('darkMode', !settings.darkMode)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${settings.darkMode ? 'bg-[#2E6A9C]' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.darkMode ? 'left-8' : 'left-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Animations Toggle */}
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            {settings.animationsEnabled ? (
                                <Zap size={20} className="text-yellow-500" />
                            ) : (
                                <ZapOff size={20} className="text-gray-400" />
                            )}
                            <div>
                                <p className="font-medium text-slate-800">Animações</p>
                                <p className="text-sm text-gray-500">Ativa/desativa animações do site público</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('animationsEnabled', !settings.animationsEnabled)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${settings.animationsEnabled ? 'bg-[#2E6A9C]' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.animationsEnabled ? 'left-8' : 'left-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3
                    className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    <Bell size={24} className="text-[#F5B500]" />
                    Notificações
                </h3>

                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                        <Mail size={20} className="text-blue-500" />
                        <div>
                            <p className="font-medium text-slate-800">Notificações por Email</p>
                            <p className="text-sm text-gray-500">Receber alertas sobre novos cadastros e etapas</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                        className={`relative w-14 h-7 rounded-full transition-colors ${settings.emailNotifications ? 'bg-[#2E6A9C]' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.emailNotifications ? 'left-8' : 'left-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-100">
                <h3
                    className="text-xl font-bold text-red-600 mb-4"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    Zona de Perigo
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Ações irreversíveis. Tenha cuidado ao utilizar estas opções.
                </p>
                <div className="flex gap-4">
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                        Limpar Cache
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                        Resetar Configurações
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
