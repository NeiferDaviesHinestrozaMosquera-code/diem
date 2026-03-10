import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Trash2, Edit3, Save, X,
  GripVertical, Eye, EyeOff, ChevronDown, ChevronUp,
  Loader2, AlertCircle, CheckCircle2, RefreshCw, Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getAllPrivacySections,
  createPrivacySection,
  updatePrivacySection,
  deletePrivacySection,
  getPrivacyMeta,
  updatePrivacyMeta,
  subscribeToPrivacySections,
} from '@/services/Privacy';
import type { PrivacySection, PrivacyMeta, NewPrivacySection, PrivacyItem } from '@/services/Privacy';
import { toast } from 'sonner';

// ── Icon options available ────────────────────────────────────────────────────
const ICON_OPTIONS = [
  'Shield', 'Lock', 'Eye', 'Database', 'UserCheck',
  'Bell', 'Globe', 'Trash2', 'Mail', 'CheckCircle',
  'Info', 'FileText', 'Key', 'Server', 'AlertCircle',
];

const COLOR_OPTIONS = [
  { label: 'Blue', value: 'from-blue-500 to-blue-600' },
  { label: 'Purple', value: 'from-purple-500 to-purple-600' },
  { label: 'Green', value: 'from-emerald-500 to-emerald-600' },
  { label: 'Orange', value: 'from-orange-500 to-orange-600' },
  { label: 'Pink', value: 'from-pink-500 to-pink-600' },
  { label: 'Yellow', value: 'from-yellow-500 to-yellow-600' },
  { label: 'Cyan', value: 'from-cyan-500 to-cyan-600' },
  { label: 'Red', value: 'from-red-500 to-red-600' },
];

// ── Blank templates ───────────────────────────────────────────────────────────
const BLANK_SECTION: NewPrivacySection = {
  title: '',
  icon_name: 'Shield',
  color: 'from-blue-500 to-blue-600',
  body_text: '',
  items: [],
  order_index: 0,
  active: true,
};

const BLANK_ITEM: PrivacyItem = { label: '', desc: '', icon: '' };

// ── SectionForm ───────────────────────────────────────────────────────────────
function SectionForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: NewPrivacySection;
  onSave: (s: NewPrivacySection) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<NewPrivacySection>(initial);

  const setField = <K extends keyof NewPrivacySection>(k: K, v: NewPrivacySection[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const addItem = () =>
    setField('items', [...form.items, { ...BLANK_ITEM }]);

  const removeItem = (i: number) =>
    setField('items', form.items.filter((_, idx) => idx !== i));

  const updateItem = (i: number, key: keyof PrivacyItem, val: string) =>
    setField('items', form.items.map((item, idx) =>
      idx === i ? { ...item, [key]: val } : item
    ));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title + Icon + Color */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
          <Input
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="e.g. Data Security"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon</label>
          <select
            value={form.icon_name}
            onChange={e => setField('icon_name', e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ICON_OPTIONS.map(icon => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color</label>
          <select
            value={form.color}
            onChange={e => setField('color', e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {COLOR_OPTIONS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color preview */}
      <div className={`h-2 rounded-full bg-gradient-to-r ${form.color} opacity-70`} />

      {/* Body text */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Introductory paragraph</label>
        <Textarea
          value={form.body_text}
          onChange={e => setField('body_text', e.target.value)}
          placeholder="Brief introduction shown at the top of this section…"
          rows={3}
        />
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Items ({form.items.length})
          </label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" /> Add item
          </Button>
        </div>

        <div className="space-y-2">
          {form.items.map((item, i) => (
            <div key={i} className="flex gap-2 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  value={item.icon ?? ''}
                  onChange={e => updateItem(i, 'icon', e.target.value)}
                  placeholder="emoji (optional)"
                  className="text-sm"
                />
                <Input
                  value={item.label ?? ''}
                  onChange={e => updateItem(i, 'label', e.target.value)}
                  placeholder="label (optional)"
                  className="text-sm"
                />
                <Input
                  value={item.desc}
                  onChange={e => updateItem(i, 'desc', e.target.value)}
                  placeholder="description *"
                  className="text-sm"
                  required
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeItem(i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {form.items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
              No items yet. Click "Add item" to start.
            </p>
          )}
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setField('active', !form.active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? 'bg-primary' : 'bg-muted'
            }`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
        <span className="text-sm font-medium">{form.active ? 'Visible to public' : 'Hidden from public'}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="flex-1 sm:flex-none">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save section
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>
    </form>
  );
}

// ── MetaForm ──────────────────────────────────────────────────────────────────
function MetaForm({ meta, onSaved }: { meta: PrivacyMeta; onSaved: (m: PrivacyMeta) => void }) {
  const [form, setForm] = useState({
    last_updated: meta.last_updated,
    page_title: meta.page_title,
    page_subtitle: meta.page_subtitle,
    contact_email: meta.contact_email,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updatePrivacyMeta(meta.id, form);
      onSaved(updated);
      toast.success('Metadata saved!');
    } catch {
      toast.error('Failed to save metadata');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Page title</label>
        <Input value={form.page_title} onChange={e => setForm(f => ({ ...f, page_title: e.target.value }))} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last updated</label>
        <Input value={form.last_updated} onChange={e => setForm(f => ({ ...f, last_updated: e.target.value }))} placeholder="January 1, 2025" />
      </div>
      <div className="sm:col-span-2 space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Page subtitle</label>
        <Textarea value={form.page_subtitle} onChange={e => setForm(f => ({ ...f, page_subtitle: e.target.value }))} rows={2} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact email (privacy)</label>
        <Input value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} type="email" />
      </div>
      <div className="flex items-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save metadata
        </Button>
      </div>
    </div>
  );
}

// ── SectionRow ────────────────────────────────────────────────────────────────
function SectionRow({
  section,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  section: PrivacySection;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${section.active
          ? 'border-border bg-card'
          : 'border-border/50 bg-muted/20 opacity-60'
        }`}
    >
      {/* Drag handle / reorder */}
      <div className="flex flex-col gap-1 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Color indicator */}
      <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${section.color} shrink-0`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{section.title}</span>
          <Badge variant={section.active ? 'default' : 'secondary'} className="text-xs shrink-0">
            {section.active ? 'Public' : 'Hidden'}
          </Badge>
          <span className="text-xs text-muted-foreground shrink-0">
            {section.items.length} item{section.items.length !== 1 ? 's' : ''}
          </span>
        </div>
        {section.body_text && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{section.body_text}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button size="icon" variant="ghost" onClick={onToggleActive} title={section.active ? 'Hide' : 'Show'}>
          {section.active
            ? <Eye className="w-4 h-4 text-green-500" />
            : <EyeOff className="w-4 h-4 text-muted-foreground" />
          }
        </Button>
        <Button size="icon" variant="ghost" onClick={onEdit} title="Edit">
          <Edit3 className="w-4 h-4 text-blue-500" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete} title="Delete"
          className="hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function PrivacyPolicyAdmin() {
  const [sections, setSections] = useState<PrivacySection[]>([]);
  const [meta, setMeta] = useState<PrivacyMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | 'new' | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'sections' | 'meta'>('sections');

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([getAllPrivacySections(), getPrivacyMeta()])
      .then(([secs, m]) => { setSections(secs); setMeta(m); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));

    const unsub = subscribeToPrivacySections(setSections);
    return unsub;
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const currentForm: NewPrivacySection | undefined = editId === 'new'
    ? { ...BLANK_SECTION, order_index: sections.length }
    : sections.find(s => s.id === editId)
      ? { ...sections.find(s => s.id === editId)! }
      : undefined;

  const handleSave = async (form: NewPrivacySection) => {
    setSaving(true);
    try {
      if (editId === 'new') {
        await createPrivacySection(form);
        toast.success('Section created!');
      } else if (editId) {
        await updatePrivacySection(editId, form);
        toast.success('Section updated!');
      }
      setEditId(null);
    } catch {
      toast.error('Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePrivacySection(id);
      toast.success('Section deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete section');
    }
  };

  const handleToggleActive = async (section: PrivacySection) => {
    try {
      await updatePrivacySection(section.id, { active: !section.active });
      toast.success(section.active ? 'Section hidden' : 'Section shown');
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;

    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];

    setSections(newSections);

    await Promise.all([
      updatePrivacySection(newSections[index].id, { order_index: index }),
      updatePrivacySection(newSections[swapIndex].id, { order_index: swapIndex }),
    ]);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading privacy policy…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">{sections.length} sections · manage content and visibility</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open('/privacy', '_blank')}>
            <Eye className="w-4 h-4 mr-1" /> Preview
          </Button>
          <Button size="sm" onClick={() => { setEditId('new'); setTab('sections'); }}>
            <Plus className="w-4 h-4 mr-1" /> New section
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {[
          { key: 'sections', label: 'Sections', icon: Shield },
          { key: 'meta', label: 'Metadata', icon: Settings },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as 'sections' | 'meta')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === key
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Sections ─────────────────────────────────────────────────── */}
      {tab === 'sections' && (
        <div className="space-y-4">

          {/* Inline edit / create form */}
          <AnimatePresence>
            {editId && currentForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-primary/40 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {editId === 'new'
                        ? <><Plus className="w-4 h-4 text-primary" /> Create new section</>
                        : <><Edit3 className="w-4 h-4 text-blue-500" /> Edit section</>
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SectionForm
                      initial={currentForm}
                      onSave={handleSave}
                      onCancel={() => setEditId(null)}
                      saving={saving}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-green-500" />
                Sections · live
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {sections.filter(s => s.active).length} public · {sections.filter(s => !s.active).length} hidden
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                  <Shield className="w-10 h-10 opacity-30" />
                  <p className="text-sm">No sections yet.</p>
                  <Button size="sm" onClick={() => setEditId('new')}>
                    <Plus className="w-4 h-4 mr-1" /> Create first section
                  </Button>
                </div>
              )}

              <AnimatePresence>
                {sections.map((section, index) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    isFirst={index === 0}
                    isLast={index === sections.length - 1}
                    onEdit={() => setEditId(section.id)}
                    onDelete={() => setDeleteId(section.id)}
                    onToggleActive={() => handleToggleActive(section)}
                    onMoveUp={() => handleMove(index, 'up')}
                    onMoveDown={() => handleMove(index, 'down')}
                  />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB: Metadata ─────────────────────────────────────────────────── */}
      {tab === 'meta' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Page metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meta ? (
              <MetaForm meta={meta} onSaved={setMeta} />
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">
                  No metadata row found. Run the SQL migration to create the <code className="font-mono">privacy_policy_meta</code> table.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Delete confirmation modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-background border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold">Delete section?</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteId)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}