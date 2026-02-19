import { Router } from 'express';
import { resolveModel } from '../config/models.js';
import { validateChatRequest } from '../middleware/validateChatRequest.js';
import { requestHuggingFaceChat } from '../services/huggingFaceService.js';

const router = Router();

router.post('/chat', validateChatRequest, async (req, res) => {
  try {
    const { model, messages, stream = false } = req.body;
    const chosenModel = resolveModel(model);

    const result = await requestHuggingFaceChat({
      modelId: chosenModel.id,
      messages,
    });

    if (!result.ok) {
      return res.status(result.status).json({
        error: result.error,
        message: result.message,
      });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const text = result.text;
      const parts = text.match(/.{1,32}/g) || [text];

      for (const chunk of parts) {
        res.write(`data: ${JSON.stringify({ token: chunk })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      res.write(`data: ${JSON.stringify({ done: true, model: chosenModel.id })}\n\n`);
      res.end();
      return undefined;
    }

    return res.status(200).json({
      model: chosenModel.id,
      message: result.text,
    });
  } catch {
    return res.status(500).json({
      error: 'internal_error',
      message: 'Failed to process chat request.',
    });
  }
});

export default router;
