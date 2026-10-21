// ─── Constantes del catálogo ────────────────────────────────────────────────
// Fuente única de verdad para categorías, materiales y datos de contacto.
// Importar desde aquí en lugar de definirlos en cada componente.

export const CATEGORIES = [
  'Sillones',
  'Sofás',
  'Mesas',
  'Recibidores',
  'Iluminación',
  'Recámaras',
  'Comedores',
  'Decoración',
];

export const MATERIALS = [
  'Roble macizo',
  'Nogal',
  'Parota',
  'Travertino',
  'Bouclé',
  'Lino lavado',
  'Herrería',
  'MDF enchapado',
];

export const SORT_OPTIONS = [
  { value: 'destacado',   label: '⭐ Recomendados' },
  { value: 'precio_asc',  label: '💲 Menor precio' },
  { value: 'precio_desc', label: '💎 Mayor precio' },
  { value: 'nombre',      label: '🔤 Nombre (A - Z)' },
];

export const WHATSAPP_NUMBER = '5215641036079';

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'muebleria_iglesias_token',
  USER:  'muebleria_iglesias_user',
};
