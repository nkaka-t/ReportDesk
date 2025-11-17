const requireRole = (...allowed) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const userRole = (user.role || '').toString().trim().toLowerCase();

  // Managers have full control — treat them as superusers and allow everything
  // Managers and admins have full control — treat them as superusers and allow everything
  if (userRole === 'manager' || userRole === 'admin') {
    console.debug(`[roles] superuser access granted for ${user.email} (${userRole})`);
    return next();
  }

  // If no specific allowed roles were provided, allow (route-level guard not restricting by role)
  const allowedLower = allowed.map(a => (a || '').toString().trim().toLowerCase()).filter(Boolean);
  if (allowedLower.length === 0) return next();

  if (allowedLower.includes(userRole)) return next();
  console.warn(`[roles] access denied for ${user.email} role=${userRole} allowed=[${allowedLower.join(',')}]`);
  return res.status(403).json({ error: 'Forbidden' });
};

module.exports = requireRole;
