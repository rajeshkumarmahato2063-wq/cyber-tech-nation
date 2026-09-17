import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

/**
 * Storage Upload Service - Enforces PDF file type and 10 MB size limits
 */
export const uploadService = {
  /**
   * Validate file format (PDF only) and size (<= 10MB)
   */
  validatePdfFile(file) {
    if (!file) return;

    const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdfType) {
      throw new Error(`Invalid file format for "${file.name}". Only PDF documents (.pdf) are allowed.`);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`);
    }
  },

  /**
   * Upload proposal PDF to Supabase storage bucket 'proposals'
   */
  async uploadProposal(file, userId = 'anon') {
    if (!file) return null;
    this.validatePdfFile(file);

    if (!isSupabaseConfigured()) {
      return `https://placeholder-storage.supabase.co/proposals/${file.name}`;
    }

    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `${userId}_proposal_${Date.now()}.${fileExt}`;
    const filePath = `proposals/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from('proposals')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage
      .from('proposals')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Upload presentation deck PPT PDF to Supabase storage bucket 'ppts'
   */
  async uploadPpt(file, userId = 'anon') {
    if (!file) return null;
    this.validatePdfFile(file);

    if (!isSupabaseConfigured()) {
      return `https://placeholder-storage.supabase.co/ppts/${file.name}`;
    }

    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `${userId}_ppt_${Date.now()}.${fileExt}`;
    const filePath = `ppts/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from('ppts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage
      .from('ppts')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
