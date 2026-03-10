import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus, Trash2, Upload, Save, RefreshCw, GripVertical,
  Pencil, Check, X, Linkedin, Github, Twitter,
  Eye, EyeOff, Users, Image as ImageIcon, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  subscribeToTeamMembers,
  uploadImage,
} from '@/services/index';
import type { TeamMember } from '@/types';

// ─── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM = (): Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'> => ({
  name:        '',
  role:        '',
  bio:         '',
  image:       '',
  linkedinUrl: '',
  githubUrl:   '',
  twitterUrl:  '',
  order:       0,
  isActive:    true,
});

type FormData = ReturnType<typeof EMPTY_FORM>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ member, size = 'md' }: { member: TeamMember | FormData; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-24 h-24' };
  const textSizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-3xl' };
  const name = 'name' in member ? member.name : '';

  if (member.image) {
    return (
      <img
        src={member.image}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary/20 shrink-0`}
      />
    );
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold ${textSizes[size]} shrink-0`}>
      {name ? name.charAt(0).toUpperCase() : <ImageIcon className="w-1/2 h-1/2" />}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function TeamAdmin() {
  const [members, setMembers]           = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [addForm, setAddForm]           = useState<FormData>(EMPTY_FORM());
  const [editForms, setEditForms]       = useState<Record<string, FormData>>({});
  const [savingId, setSavingId]         = useState<string | null>(null);
  const [uploadingId, setUploadingId]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isAdding, setIsAdding]         = useState(false);
  const [reordering, setReordering]     = useState(false);
  const membersRef = useRef<TeamMember[]>([]);

  // ── Load & realtime ──────────────────────────────────────────────────────────
  useEffect(() => {
    let unsub: (() => void) | null = null;

    const init = async () => {
      try {
        const data = await getTeamMembers();
        setMembers(data);
        membersRef.current = data;
      } catch {
        toast.error('Error al cargar el equipo');
      } finally {
        setIsLoading(false);
      }

      unsub = subscribeToTeamMembers((data) => {
        setMembers(data);
        membersRef.current = data;
      });
    };

    init();
    return () => { unsub?.(); };
  }, []);

  // ── Add member ───────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!addForm.name.trim() || !addForm.role.trim()) {
      toast.error('El nombre y el rol son obligatorios');
      return;
    }

    setIsAdding(true);
    try {
      const newMember = await addTeamMember({
        ...addForm,
        order: members.length,
      });
      setMembers(prev => [...prev, newMember]);
      membersRef.current = [...membersRef.current, newMember];
      setAddForm(EMPTY_FORM());
      setShowAddForm(false);
      toast.success(`${newMember.name} agregado al equipo`);
    } catch {
      toast.error('Error al agregar el miembro');
    } finally {
      setIsAdding(false);
    }
  };

  // ── Edit member ──────────────────────────────────────────────────────────────
  const startEdit = (member: TeamMember) => {
    setEditForms(prev => ({
      ...prev,
      [member.id]: {
        name:        member.name,
        role:        member.role,
        bio:         member.bio,
        image:       member.image,
        linkedinUrl: member.linkedinUrl ?? '',
        githubUrl:   member.githubUrl   ?? '',
        twitterUrl:  member.twitterUrl  ?? '',
        order:       member.order,
        isActive:    member.isActive,
      },
    }));
    setEditingId(member.id);
  };

  const cancelEdit = (id: string) => {
    setEditForms(prev => { const n = { ...prev }; delete n[id]; return n; });
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    const form = editForms[id];
    if (!form) return;
    if (!form.name.trim() || !form.role.trim()) {
      toast.error('Nombre y rol son obligatorios');
      return;
    }

    setSavingId(id);
    try {
      await updateTeamMember(id, form);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...form } : m));
      membersRef.current = membersRef.current.map(m => m.id === id ? { ...m, ...form } : m);
      cancelEdit(id);
      toast.success('Cambios guardados');
    } catch {
      toast.error('Error al guardar cambios');
    } finally {
      setSavingId(null);
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────────
  const toggleActive = async (member: TeamMember) => {
    const newVal = !member.isActive;
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, isActive: newVal } : m));
    try {
      await updateTeamMember(member.id, { isActive: newVal });
      toast.success(newVal ? `${member.name} activado` : `${member.name} ocultado`);
    } catch {
      setMembers(prev => prev.map(m => m.id === member.id ? { ...m, isActive: !newVal } : m));
      toast.error('Error al actualizar estado');
    }
  };

  // ── Delete member ────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTeamMember(deleteTarget.id);
      setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
      membersRef.current = membersRef.current.filter(m => m.id !== deleteTarget.id);
      toast.success(`${deleteTarget.name} eliminado`);
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Image upload ─────────────────────────────────────────────────────────────
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'add' | string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(target);
    const toastId = toast.loading('Subiendo imagen...');
    try {
      const url = await uploadImage(file, 'team');

      if (target === 'add') {
        setAddForm(prev => ({ ...prev, image: url }));
      } else {
        setEditForms(prev => ({
          ...prev,
          [target]: { ...prev[target], image: url },
        }));
      }
      toast.success('Imagen subida', { id: toastId });
    } catch {
      toast.error('Error al subir imagen', { id: toastId });
    } finally {
      setUploadingId(null);
    }
  };

  // ── Drag reorder ─────────────────────────────────────────────────────────────
  const handleReorder = (newOrder: TeamMember[]) => {
    setMembers(newOrder);
  };

  const saveOrder = async () => {
    setReordering(true);
    try {
      const updates = members.map((m, idx) => ({ id: m.id, order: idx }));
      await reorderTeamMembers(updates);
      setMembers(prev => prev.map((m, idx) => ({ ...m, order: idx })));
      toast.success('Orden guardado');
    } catch {
      toast.error('Error al guardar el orden');
    } finally {
      setReordering(false);
    }
  };

  // ── Image field component (reused in add & edit) ──────────────────────────────
  const ImageField = ({
    value,
    onChange,
    onUpload,
    uploading,
    targetId,
  }: {
    value: string;
    onChange: (val: string) => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    targetId: string;
  }) => (
    <div className="space-y-2">
      <Label>Foto</Label>
      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0 ring-2 ring-border">
          {value ? (
            <>
              <img src={value} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Upload + URL */}
        <div className="flex-1 space-y-2">
          <label htmlFor={`upload-${targetId}`}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? 'Subiendo…' : 'Subir imagen'}
            </div>
            <input
              id={`upload-${targetId}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </label>
          <Input
            placeholder="… o pega una URL"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="text-xs h-8"
          />
        </div>
      </div>
    </div>
  );

  // ─── Edit form component ─────────────────────────────────────────────────────
  const EditForm = ({ member }: { member: TeamMember }) => {
    const form = editForms[member.id];
    if (!form) return null;
    const isSaving  = savingId  === member.id;
    const isUploading = uploadingId === member.id;

    const patch = (key: keyof FormData, val: any) =>
      setEditForms(prev => ({ ...prev, [member.id]: { ...prev[member.id], [key]: val } }));

    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pt-4 border-t border-border space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={e => patch('name', e.target.value)} placeholder="Davies Hinestroza" />
            </div>
            <div className="space-y-1.5">
              <Label>Rol / Cargo *</Label>
              <Input value={form.role} onChange={e => patch('role', e.target.value)} placeholder="CEO & Founder" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Bio <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Textarea
              value={form.bio}
              onChange={e => patch('bio', e.target.value)}
              placeholder="Breve descripción del miembro del equipo…"
              rows={2}
            />
          </div>

          <ImageField
            value={form.image}
            onChange={val => patch('image', val)}
            onUpload={e => handleImageUpload(e, member.id)}
            uploading={isUploading}
            targetId={`edit-${member.id}`}
          />

          {/* Social links */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                LinkedIn
              </Label>
              <Input
                value={form.linkedinUrl}
                onChange={e => patch('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </Label>
              <Input
                value={form.githubUrl}
                onChange={e => patch('githubUrl', e.target.value)}
                placeholder="https://github.com/..."
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-sky-500" />
                Twitter / X
              </Label>
              <Input
                value={form.twitterUrl}
                onChange={e => patch('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/..."
                className="text-xs"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <Switch
              checked={form.isActive}
              onCheckedChange={val => patch('isActive', val)}
            />
            <Label className="cursor-pointer">
              {form.isActive ? 'Visible en el sitio' : 'Oculto del sitio público'}
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => cancelEdit(member.id)}
              className="gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5 ml-auto"
              onClick={() => setDeleteTarget(member)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </Button>
            <Button
              size="sm"
              onClick={() => handleSaveEdit(member.id)}
              disabled={isSaving}
              className="gap-1.5"
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Guardar
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="h-9 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            Meet Our Team
          </h1>
          <p className="text-muted-foreground mt-1">
            {members.length} miembro{members.length !== 1 ? 's' : ''} ·{' '}
            {members.filter(m => m.isActive).length} visible{members.filter(m => m.isActive).length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {members.length > 1 && (
            <Button
              variant="outline"
              onClick={saveOrder}
              disabled={reordering}
              className="gap-2"
            >
              {reordering ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar orden
            </Button>
          )}
          <Button onClick={() => { setShowAddForm(v => !v); setAddForm(EMPTY_FORM()); }} className="gap-2">
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Cancelar' : 'Agregar miembro'}
          </Button>
        </div>
      </div>

      {/* ── Add form ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border-primary/40 shadow-lg shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Nuevo miembro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Nombre *</Label>
                    <Input
                      value={addForm.name}
                      onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Davies Hinestroza"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Rol / Cargo *</Label>
                    <Input
                      value={addForm.role}
                      onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
                      placeholder="CEO & Founder"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Bio <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                  <Textarea
                    value={addForm.bio}
                    onChange={e => setAddForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Breve descripción del miembro…"
                    rows={2}
                  />
                </div>

                <ImageField
                  value={addForm.image}
                  onChange={val => setAddForm(f => ({ ...f, image: val }))}
                  onUpload={e => handleImageUpload(e, 'add')}
                  uploading={uploadingId === 'add'}
                  targetId="new-member"
                />

                {/* Social links */}
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                      LinkedIn
                    </Label>
                    <Input
                      value={addForm.linkedinUrl}
                      onChange={e => setAddForm(f => ({ ...f, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/..."
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" />
                      GitHub
                    </Label>
                    <Input
                      value={addForm.githubUrl}
                      onChange={e => setAddForm(f => ({ ...f, githubUrl: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5">
                      <Twitter className="w-3.5 h-3.5 text-sky-500" />
                      Twitter / X
                    </Label>
                    <Input
                      value={addForm.twitterUrl}
                      onChange={e => setAddForm(f => ({ ...f, twitterUrl: e.target.value }))}
                      placeholder="https://twitter.com/..."
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Active + Submit */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={addForm.isActive}
                      onCheckedChange={val => setAddForm(f => ({ ...f, isActive: val }))}
                    />
                    <Label>Visible en el sitio</Label>
                  </div>
                  <Button onClick={handleAdd} disabled={isAdding} className="gap-2">
                    {isAdding ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isAdding ? 'Guardando…' : 'Agregar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drag hint ───────────────────────────────────────────────────────── */}
      {members.length > 1 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5" />
          Arrastra por el ícono <GripVertical className="w-3 h-3 inline" /> para reordenar · recuerda hacer clic en <strong>Guardar orden</strong>
        </p>
      )}

      {/* ── Member list ─────────────────────────────────────────────────────── */}
      {members.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-border text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h4 className="font-semibold mb-1">Sin miembros aún</h4>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Agrega los miembros de tu equipo para mostrarlos en la sección "Meet Our Team".
          </p>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar primer miembro
          </Button>
        </motion.div>
      ) : (
        <Reorder.Group
          axis="y"
          values={members}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {members.map((member, index) => {
            const isEditing = editingId === member.id;

            return (
              <Reorder.Item key={member.id} value={member}>
                <motion.div
                  layout
                  className={`rounded-2xl border bg-card transition-shadow ${
                    isEditing
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-border hover:border-primary/30'
                  } ${!member.isActive ? 'opacity-60' : ''}`}
                >
                  {/* ── Row header ── */}
                  <div className="flex items-center gap-3 p-4">
                    {/* Drag handle */}
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Avatar */}
                    <Avatar member={member} size="sm" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{member.name}</p>
                        {!member.isActive && (
                          <Badge variant="secondary" className="text-xs shrink-0">Oculto</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                    </div>

                    {/* Social badges */}
                    <div className="hidden sm:flex gap-1 shrink-0">
                      {member.linkedinUrl && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
                      {member.githubUrl   && <Github   className="w-3.5 h-3.5" />}
                      {member.twitterUrl  && <Twitter  className="w-3.5 h-3.5 text-sky-500" />}
                    </div>

                    {/* Position badge */}
                    <Badge variant="outline" className="text-xs shrink-0 hidden sm:flex">
                      #{index + 1}
                    </Badge>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Visibility toggle */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title={member.isActive ? 'Ocultar del sitio' : 'Mostrar en el sitio'}
                        onClick={() => toggleActive(member)}
                      >
                        {member.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </Button>

                      {/* Edit toggle */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title={isEditing ? 'Cerrar edición' : 'Editar'}
                        onClick={() => isEditing ? cancelEdit(member.id) : startEdit(member)}
                      >
                        {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                      </Button>

                      {/* Delete */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Eliminar"
                        onClick={() => setDeleteTarget(member)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* ── Inline edit form ── */}
                  <AnimatePresence>
                    {isEditing && <EditForm member={member} />}
                  </AnimatePresence>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* ── Delete confirmation dialog ───────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Eliminar miembro
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar a <strong>{deleteTarget?.name}</strong>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}