import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar as CalendarIcon, Check, X, Flag, CornerUpRight, Activity, FileText, Hash, Info } from 'lucide-react';
import { supabase, type Stage } from '../../lib/supabase';

const statusLabels = {
    upcoming: 'Próxima',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

export function Stages() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Stage | null>(null);

    useEffect(() => {
        fetchStages();
    }, []);

    const fetchStages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('stages')
            .select('*')
            .order('stage_number', { ascending: true });

        if (!error && data) {
            setStages(data);
        }
        setLoading(false);
    };

    const handleEdit = (stage: Stage) => {
        setEditingId(stage.id);
        setEditForm({ ...stage });
    };

    const handleSave = async () => {
        if (!editForm) return;

        const { error } = await supabase
            .from('stages')
            .update({
                name: editForm.name,
                location: editForm.location,
                date: editForm.date,
                is_active: editForm.is_active,
                track_length: editForm.track_length,
                track_corners: editForm.track_corners,
                track_record: editForm.track_record,
                track_description: editForm.track_description,
                track_id: editForm.track_id
            })
            .eq('id', editForm.id);

        if (!error) {
            setStages(stages.map(s => s.id === editForm.id ? editForm : s));
            setEditingId(null);
            setEditForm(null);
        } else {
            alert('Erro ao salvar: ' + error.message);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta etapa?')) {
            const { error } = await supabase
                .from('stages')
                .delete()
                .eq('id', id);

            if (!error) {
                setStages(stages.filter(s => s.id !== id));
            } else {
                alert('Erro ao excluir: ' + error.message);
            }
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E6A9C]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-500">Gerencie as etapas e os dados técnicos das pistas</p>
                <button
                    onClick={() => alert('Função de criar nova etapa em desenvolvimento. Use a edição para os registros atuais.')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors"
                >
                    <Plus size={20} />
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>Nova Etapa</span>
                </button>
            </div>

            {/* Stages Grid (Mobile) / Table (Desktop) */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Desktop View (lg and above) */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Etapa Info</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Local & Pista</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Metadata Técnico</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stages.map((stage) => (
                                <tr key={stage.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === stage.id ? 'bg-blue-50/30' : ''}`}>
                                    {editingId === stage.id && editForm ? (
                                        <td colSpan={4} className="p-8">
                                            {/* (Existing Edit Form Content remains same) */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {/* Column 1: Basic Info */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                                        <CalendarIcon size={16} className="text-[#2E6A9C]" />
                                                        Informações Básicas
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Nome da Etapa</label>
                                                            <input
                                                                type="text"
                                                                value={editForm.name}
                                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2E6A9C] outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Localização</label>
                                                            <input
                                                                type="text"
                                                                value={editForm.location}
                                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Data da Corrida</label>
                                                            <input
                                                                type="date"
                                                                value={editForm.date}
                                                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`active-${stage.id}`}
                                                                checked={editForm.is_active}
                                                                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                                                                className="rounded border-gray-300 text-[#2E6A9C] focus:ring-[#2E6A9C]"
                                                            />
                                                            <label htmlFor={`active-${stage.id}`} className="text-sm font-medium text-gray-700">Etapa Ativa (Próxima)</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Column 2: Technical Data */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                                        <Activity size={16} className="text-[#F5B500]" />
                                                        Dados Técnicos (HUD 3D)
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                    <Flag size={10} /> Extensão
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="ex: 1.250m"
                                                                    value={editForm.track_length || ''}
                                                                    onChange={(e) => setEditForm({ ...editForm, track_length: e.target.value })}
                                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                    <CornerUpRight size={10} /> Curvas
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="14"
                                                                    value={editForm.track_corners || 0}
                                                                    onChange={(e) => setEditForm({ ...editForm, track_corners: parseInt(e.target.value) })}
                                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Activity size={10} /> Recorde da Pista
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="ex: 48.920s"
                                                                value={editForm.track_record || ''}
                                                                onChange={(e) => setEditForm({ ...editForm, track_record: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-[#F5B500]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Hash size={10} /> ID do Traçado (SVG)
                                                            </label>
                                                            <select
                                                                value={editForm.track_id || 'KNO_A'}
                                                                onChange={(e) => setEditForm({ ...editForm, track_id: e.target.value })}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                            >
                                                                <option value="KNO_A">KNO Traçado Norte</option>
                                                                <option value="KNO_B">KNO Traçado Sul</option>
                                                                <option value="Paulínia">San Marino Paulínia</option>
                                                                <option value="DEFAULT">Circuito Padrão</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Column 3: Description & Actions */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                                        <FileText size={16} className="text-gray-400" />
                                                        Descrição
                                                    </h4>
                                                    <div>
                                                        <textarea
                                                            value={editForm.track_description || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, track_description: e.target.value })}
                                                            rows={4}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                                                            placeholder="Breve descrição técnica do circuito..."
                                                        />
                                                    </div>
                                                    <div className="flex gap-3 pt-4">
                                                        <button
                                                            onClick={handleSave}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-[#2E6A9C] text-white py-3 rounded-xl font-bold hover:bg-[#1e4669] transition-all"
                                                            style={{ fontFamily: 'Teko, sans-serif', letterSpacing: '0.1em' }}
                                                        >
                                                            <Check size={20} /> SALVAR
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="px-6 border border-gray-200 text-gray-400 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="py-6 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 text-xl leading-none mb-1" style={{ fontFamily: 'Teko, sans-serif' }}>
                                                        {stage.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                        <CalendarIcon size={12} />
                                                        {formatDate(stage.date)}
                                                        {stage.is_active && (
                                                            <span className="ml-2 px-2 py-0.5 bg-[#F5B500]/10 text-[#F5B500] rounded text-[10px] font-black uppercase">Ativa</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 rounded-lg text-[#2E6A9C]">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700">{stage.location}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">{stage.track_id || 'Padrão'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Recorde</span>
                                                        <span className="text-sm font-mono font-bold text-[#F5B500]">{stage.track_record || '-'}</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-100" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Extensão</span>
                                                        <span className="text-sm font-bold text-slate-600">{stage.track_length || '-'}</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-100" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Curvas</span>
                                                        <span className="text-sm font-bold text-slate-600">{stage.track_corners || '-'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(stage)}
                                                        className="p-3 text-[#2E6A9C] hover:bg-blue-50 bg-slate-50 rounded-xl transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(stage.id)}
                                                        className="p-3 text-red-500 hover:bg-red-50 bg-slate-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (sm/md) */}
                <div className="lg:hidden divide-y divide-gray-100">
                    {stages.map((stage) => (
                        <div key={stage.id} className="p-4 space-y-4">
                            {editingId === stage.id && editForm ? (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Teko, sans-serif' }}>Editando {stage.name}</h3>
                                    {/* Simplified Edit Form for Mobile */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase">Nome</label>
                                            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase">Local</label>
                                            <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Extensão</label>
                                                <input type="text" value={editForm.track_length || ''} onChange={e => setEditForm({ ...editForm, track_length: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase">Curvas</label>
                                                <input type="number" value={editForm.track_corners || 0} onChange={e => setEditForm({ ...editForm, track_corners: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handleSave} className="flex-1 bg-[#2E6A9C] text-white py-2 rounded-lg font-bold text-xs uppercase tracking-widest">Salvar</button>
                                            <button onClick={handleCancel} className="px-4 border border-gray-200 rounded-lg"> <X size={18} /> </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-800 text-lg" style={{ fontFamily: 'Teko, sans-serif' }}>{stage.name}</h3>
                                            {stage.is_active && <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[8px] font-black rounded uppercase">Ativa</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                            <CalendarIcon size={12} /> {formatDate(stage.date)}
                                        </div>
                                        <div className="text-xs text-[#2E6A9C] font-bold flex items-center gap-1">
                                            <MapPin size={12} /> {stage.location}
                                        </div>
                                        <div className="flex items-center gap-3 pt-2 text-[10px] text-gray-400 font-bold uppercase">
                                            <span>{stage.track_length || '-'}</span>
                                            <span>•</span>
                                            <span>{stage.track_corners || '-'} Curvas</span>
                                            <span>•</span>
                                            <span className="text-[#F5B500]">{stage.track_record || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(stage)} className="p-2 bg-blue-50 text-[#2E6A9C] rounded-lg"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(stage.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hint Box */}
            <div className="bg-[#2E6A9C]/5 border border-[#2E6A9C]/10 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-[#2E6A9C] text-white rounded-xl">
                    <Info size={24} />
                </div>
                <div>
                    <h5 className="font-bold text-[#2E6A9C] uppercase tracking-wider mb-1" style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.25rem' }}>Dica do Sistema</h5>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        As informações técnicas inseridas aqui (Recorde, Extensão, Curvas e Descrição) serão exibidas automaticamente no <strong>Scanner 3D</strong> do Calendário para todos os usuários. Certifique-se de associar o <strong>ID do Traçado</strong> correto para que o desenho da pista corresponda aos dados.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Stages;
