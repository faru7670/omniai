const SUPPORTED_ROLES = new Set(['system', 'user', 'assistant']);

export function validateChatRequest(req, res, next) {
  const { model, messages, stream } = req.body || {};

  if (model && typeof model !== 'string') {
    return res.status(400).json({ error: 'validation_error', message: '`model` must be a string.' });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: 'validation_error', message: '`messages` must be a non-empty array.' });
  }

  const invalid = messages.find(
    (item) =>
      !item ||
      typeof item !== 'object' ||
      !SUPPORTED_ROLES.has(item.role) ||
      typeof item.content !== 'string' ||
      item.content.trim().length === 0,
  );

  if (invalid) {
    return res.status(400).json({
      error: 'validation_error',
      message: 'Each message must include valid `role` and non-empty string `content`.',
    });
  }

  if (typeof stream !== 'undefined' && typeof stream !== 'boolean') {
    return res.status(400).json({ error: 'validation_error', message: '`stream` must be boolean.' });
  }

  return next();
}
