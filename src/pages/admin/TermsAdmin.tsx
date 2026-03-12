import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, GripVertical, Eye, EyeOff,
  FileText, Loader2, Settings2, X, ChevronDown, ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label }    from '@/components/ui/label';
import { Switch }   from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge }  from '@/components/ui/badge';
import { toast }  from 'sonner';
import {
  getTermsMeta, updateTermsMeta,
  getTermsSections, addTermsSection, updateTermsSection,
  deleteTermsSection, reorderTermsSections,
} from '@/services/index';
import type { TermsMeta, TermsSection, TermsItem, NewTermsSection } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  'FileText', 'CheckCircle', 'Settings', 'Shield', 'CreditCard',
  'AlertTriangle', 'XCircle', 'Mail', 'Scale', 'BookOpen',
  'Lock', 'Globe', 'Users', 'Star', 'Info',
];

const COLOR_PRESETS = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899',
  '#ef4444', '#8b5cf6', '#3b82f6', '#14b8a6',
  '#f97316', '#64748b',
];

const EMPTY_SECTION: NewTermsSection = {
  title:       '',
  icon_name:   'FileText',
  color:       '#6366f1',
  body_text:   '',
  items:       [],
  order_index: 0,
  active:      true,
};

// ─── Item editor row ──────────────────────────────────────────────────────────

function ItemRow({
  item, index, onChange, onRemove,
}: {
  item: TermsItem;
  index: number;
  onChange: (i: number, field: keyof TermsItem, value: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-2 items-start"
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          placeholder="Label (optional)"
          value={item.label ?? ''}
          onChange={e => onChange(index, 'label', e.target.value)}
          className="text-sm"
        />
        <Input
          placeholder="Description *"
          value={item.desc}
          onChange={e => onChange(index, 'desc', e.target.value)}
          className="text-sm"
        />
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => onRemove(index)}
        className="shrink-0 h-9 w-9 text-destructive hover:bg-destructive/10"
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// ─── Section form dialog ──────────────────────────────────────────────────────

function SectionDialog({
  open,
  onClose,
  initial,
  onSave,
}: {
  open:    boolean;
  onClose: () => void;
  initial: NewTermsSection | TermsSection;
  onSave:  (data: NewTermsSection) => Promise<void>;
}) {
  const [form, setForm]       = useState<NewTermsSection & { id?: string }>(initial as any);
  const [saving, setSaving]   = useState(false);

  useEffect(() => { setForm(initial as any); }, [initial]);

  const set = (key: keyof NewTermsSection, val: NewTermsSection[keyof NewTermsSection]) =>
    setForm((prev: NewTermsSection & { id?: string }) => ({ ...prev, [key]: val }));

  const addItem = () => set('items', [...(form.items ?? []), { label: '', desc: '' }]);

  const updateItem = (i: number, field: keyof TermsItem, val: string) => {
    const items = [...(form.items ?? [])];
    items[i] = { ...items[i], [field]: val };
    set('items', items);
  };

  const removeItem = (i: number) => {
    set('items', (form.items ?? []).filter((_: TermsItem, idx: number) => idx !== i));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      toast.error('Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {('id' in initial && initial.id) ? 'Edit Section' : 'New Section'}
          </DialogTitle>
          <DialogDescription>
            Configure the content and appearance of this Terms section.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Acceptance of Terms"
            />
          </div>

          {/* Icon + Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <select
                value={form.icon_name}
                onChange={e => set('icon_name', e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {ICON_OPTIONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={form.color}
                  onChange={e => set('color', e.target.value)}
                  className="w-10 h-10 p-1 cursor-pointer"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {COLOR_PRESETS.map(c => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() => set('color', c)}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: form.color === c ? '#fff' : 'transparent',
                        boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body text */}
          <div className="space-y-1.5">
            <Label>Body text</Label>
            <Textarea
              value={form.body_text}
              onChange={e => set('body_text', e.target.value)}
              rows={3}
              placeholder="Short description shown when section is expanded…"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="active-toggle"
              checked={form.active}
              onCheckedChange={v => set('active', v)}
            />
            <Label htmlFor="active-toggle" className="cursor-pointer">
              {form.active ? 'Visible on public page' : 'Hidden (draft)'}
            </Label>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>List items</Label>
              <Button type="button" size="sm" variant="outline" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" /> Add item
              </Button>
            </div>

            <AnimatePresence>
              {(form.items ?? []).map((item, i) => (
                <ItemRow
                  key={i}
                  item={item}
                  index={i}
                  onChange={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>

            {(form.items ?? []).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3 border border-dashed border-border rounded-lg">
                No items yet. Click "Add item" to start.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Saving…' : 'Save section'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Meta dialog ──────────────────────────────────────────────────────────────

function MetaDialog({
  open, onClose, initial, onSave,
}: {
  open:    boolean;
  onClose: () => void;
  initial: TermsMeta | null;
  onSave:  (data: Partial<TermsMeta>) => Promise<void>;
}) {
  const [form, setForm]     = useState<Partial<TermsMeta>>(initial ?? {});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? {}); }, [initial]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      toast.error('Failed to update page info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" /> Page settings
          </DialogTitle>
          <DialogDescription>
            Edit the title, subtitle, and contact email shown on the public Terms page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Page title</Label>
            <Input
              value={form.page_title ?? ''}
              onChange={e => setForm((p: Partial<TermsMeta>) => ({ ...p, page_title: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Page subtitle</Label>
            <Textarea
              value={form.page_subtitle ?? ''}
              onChange={e => setForm((p: Partial<TermsMeta>) => ({ ...p, page_subtitle: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Last updated date</Label>
            <Input
              type="date"
              value={form.last_updated ?? ''}
              onChange={e => setForm((p: Partial<TermsMeta>) => ({ ...p, last_updated: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Contact email</Label>
            <Input
              type="email"
              value={form.contact_email ?? ''}
              onChange={e => setForm((p: Partial<TermsMeta>) => ({ ...p, contact_email: e.target.value }))}
              placeholder="legal@example.com"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  section, onEdit, onDelete, onToggleActive,
}: {
  section:        TermsSection;
  onEdit:         (s: TermsSection) => void;
  onDelete:       (s: TermsSection) => void;
  onToggleActive: (s: TermsSection) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reorder.Item value={section} id={section.id}>
      <motion.div
        layout
        className={`group relative border rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md ${
          !section.active ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Drag handle */}
          <span className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors touch-none">
            <GripVertical className="w-5 h-5" />
          </span>

          {/* Color badge */}
          <span
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${section.color}18`, border: `1.5px solid ${section.color}40` }}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
          </span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{section.title}</span>
              <Badge variant={section.active ? 'default' : 'secondary'} className="text-xs">
                {section.active ? 'Active' : 'Hidden'}
              </Badge>
              {section.items?.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            {section.body_text && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                {section.body_text}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              title={section.active ? 'Hide' : 'Show'}
              onClick={() => onToggleActive(section)}
            >
              {section.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setExpanded(p => !p)}
              title="Preview items"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(section)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(section)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Inline preview */}
        <AnimatePresence>
          {expanded && section.items?.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <ul className="px-6 py-4 space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    {item.label && <strong className="text-foreground">{item.label}:</strong>}
                    {item.desc}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
}

// ─── Main admin component ─────────────────────────────────────────────────────

export function TermsAdmin() {
  const [meta, setMeta]           = useState<TermsMeta | null>(null);
  const [sections, setSections]   = useState<TermsSection[]>([]);
  const [loading, setLoading]     = useState(true);

  const [sectionDialog, setSectionDialog] = useState<{
    open: boolean;
    data: NewTermsSection | TermsSection;
  }>({ open: false, data: EMPTY_SECTION });

  const [metaDialog, setMetaDialog] = useState(false);

  // ── Load ──
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [m, s] = await Promise.all([getTermsMeta(), getTermsSections()]);
      setMeta(m);
      setSections(s);
    } catch {
      toast.error('Failed to load Terms data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Reorder (drag-drop save) ──
  const handleReorder = async (reordered: TermsSection[]) => {
    setSections(reordered); // optimistic
    try {
      await reorderTermsSections(reordered.map(s => s.id));
    } catch {
      toast.error('Failed to save order');
      load(); // revert
    }
  };

  // ── Save section (add or update) ──
  const handleSaveSection = async (data: NewTermsSection) => {
    const isEdit = 'id' in sectionDialog.data && !!(sectionDialog.data as TermsSection).id;

    if (isEdit) {
      const id = (sectionDialog.data as TermsSection).id;
      await updateTermsSection(id, data);
      toast.success('Section updated');
    } else {
      const nextOrder = sections.length + 1;
      await addTermsSection({ ...data, order_index: nextOrder });
      toast.success('Section added');
    }
    await load();
  };

  // ── Delete ──
  const handleDelete = async (section: TermsSection) => {
    if (!window.confirm(`Delete "${section.title}"? This cannot be undone.`)) return;
    try {
      await deleteTermsSection(section.id);
      toast.success('Section deleted');
      await load();
    } catch {
      toast.error('Failed to delete section');
    }
  };

  // ── Toggle active ──
  const handleToggleActive = async (section: TermsSection) => {
    try {
      await updateTermsSection(section.id, { active: !section.active });
      await load();
      toast.success(section.active ? 'Section hidden' : 'Section published');
    } catch {
      toast.error('Failed to update section');
    }
  };

  // ── Save meta ──
  const handleSaveMeta = async (data: Partial<TermsMeta>) => {
    await updateTermsMeta(data);
    toast.success('Page settings saved');
    await load();
  };

  // ── Stats ──
  const activeCount = sections.filter(s => s.active).length;

  return (
    <div className="p-2 space-y-8 max-w-8xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage sections and content of the public Terms page
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMetaDialog(true)}>
            <Settings2 className="w-4 h-4 mr-2" />
            Page settings
          </Button>
          <Button
            size="sm"
            onClick={() => setSectionDialog({ open: true, data: EMPTY_SECTION })}
          >
            <Plus className="w-4 h-4 mr-2" />
            New section
          </Button>
        </div>
      </div>

      {/* Meta summary card */}
      {meta && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{meta.page_title}</p>
              <p className="text-xs text-muted-foreground">{meta.page_subtitle}</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground shrink-0">
              <span>📅 Updated: {meta.last_updated}</span>
              <span>✉️ {meta.contact_email}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total sections', value: sections.length, color: 'text-foreground' },
          { label: 'Active',         value: activeCount,      color: 'text-emerald-600' },
          { label: 'Hidden',         value: sections.length - activeCount, color: 'text-muted-foreground' },
        ].map(stat => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sections list */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading sections…
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl space-y-3">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">No sections yet.</p>
          <Button
            variant="outline"
            onClick={() => setSectionDialog({ open: true, data: EMPTY_SECTION })}
          >
            <Plus className="w-4 h-4 mr-2" /> Add first section
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <GripVertical className="w-3.5 h-3.5" />
            Drag sections to reorder them on the public page
          </p>
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {sections.map(section => (
              <SectionCard
                key={section.id}
                section={section}
                onEdit={s => setSectionDialog({ open: true, data: s })}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Section dialog */}
      <SectionDialog
        open={sectionDialog.open}
        onClose={() => setSectionDialog(p => ({ ...p, open: false }))}
        initial={sectionDialog.data}
        onSave={handleSaveSection}
      />

      {/* Meta dialog */}
      <MetaDialog
        open={metaDialog}
        onClose={() => setMetaDialog(false)}
        initial={meta}
        onSave={handleSaveMeta}
      />
    </div>
  );
}