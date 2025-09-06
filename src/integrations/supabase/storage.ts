export const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'public';

export const getPublicUrl = (path: string) => {
  // Kept as a small helper in case we need to change visibility strategy later
  return path;
};
