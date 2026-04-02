const supabase = require('../db');
const { createError } = require('../middleware/error.middleware');
const { logAudit } = require('../middleware/audit.middleware');

const COMPLIANCE_THRESHOLD = 100000; // Auto-flag above ₹1,00,000

const createRecord = async (userId, payload, actor) => {
  // Auto-flag high-value transactions
  const complianceStatus = Number(payload.amount) >= COMPLIANCE_THRESHOLD ? 'flagged' : 'clean';

  const { data, error } = await supabase
    .from('financial_records')
    .insert({ ...payload, user_id: userId, compliance_status: complianceStatus })
    .select()
    .single();

  if (error) throw createError(500, 'Failed to create record');

  await logAudit(actor, 'CREATE', 'financial_record', data.id, null, data);
  return data;
};

const listRecords = async ({ type, category, from, to, page = 1, limit = 10, compliance_status }) => {
  const offset = (page - 1) * limit;

  let query = supabase
    .from('financial_records')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) query = query.eq('type', type);
  if (category) query = query.ilike('category', `%${category}%`);
  if (from) query = query.gte('date', from);
  if (to) query = query.lte('date', to);
  if (compliance_status) query = query.eq('compliance_status', compliance_status);

  const { data, error, count } = await query;
  if (error) throw createError(500, 'Failed to fetch records');

  return { records: data, total: count, page: Number(page), limit: Number(limit) };
};

const updateRecord = async (id, payload, actor) => {
  // Fetch before value for audit
  const { data: before } = await supabase.from('financial_records').select('*').eq('id', id).single();

  // Re-evaluate compliance if amount changes
  let updatePayload = { ...payload };
  if (payload.amount !== undefined) {
    updatePayload.compliance_status = Number(payload.amount) >= COMPLIANCE_THRESHOLD ? 'flagged' : 'clean';
  }

  const { data, error } = await supabase
    .from('financial_records')
    .update(updatePayload)
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error || !data) throw createError(404, 'Record not found');

  await logAudit(actor, 'UPDATE', 'financial_record', id, before, data);
  return data;
};

const updateCompliance = async (id, compliance_status, actor) => {
  const { data: before } = await supabase.from('financial_records').select('*').eq('id', id).single();
  if (!before) throw createError(404, 'Record not found');

  const { data, error } = await supabase
    .from('financial_records')
    .update({ compliance_status })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error || !data) throw createError(404, 'Record not found');

  await logAudit(actor, 'COMPLIANCE_REVIEW', 'financial_record', id, { compliance_status: before.compliance_status }, { compliance_status });
  return data;
};

const deleteRecord = async (id, actor) => {
  const { data: before } = await supabase.from('financial_records').select('*').eq('id', id).single();

  const { data, error } = await supabase
    .from('financial_records')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error || !data) throw createError(404, 'Record not found');

  await logAudit(actor, 'DELETE', 'financial_record', id, before, null);
  return { message: 'Record deleted successfully' };
};

module.exports = { createRecord, listRecords, updateRecord, updateCompliance, deleteRecord };