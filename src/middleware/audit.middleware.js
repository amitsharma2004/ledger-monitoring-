const supabase = require('../db');

/**
 * Logs an action to the audit_logs table.
 * @param {object} user - { id, email }
 * @param {string} action - 'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLIANCE_REVIEW'
 * @param {string} resourceType - e.g. 'financial_record'
 * @param {string} resourceId
 * @param {object|null} beforeValue
 * @param {object|null} afterValue
 */
const logAudit = async (user, action, resourceType, resourceId, beforeValue = null, afterValue = null) => {
  try {
    await supabase.from('audit_logs').insert({
      user_id: user?.id || null,
      user_email: user?.email || null,
      action,
      resource_type: resourceType,
      resource_id: resourceId ? String(resourceId) : null,
      before_value: beforeValue,
      after_value: afterValue,
    });
  } catch (err) {
    // Audit failures should not break the request
    console.error('Audit log error:', err.message);
  }
};

module.exports = { logAudit };