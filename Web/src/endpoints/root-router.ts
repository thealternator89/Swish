import { Request, Response, Router } from 'express';
import { apiRouter } from './api-router';

import * as path from 'path';

const router = Router();

const loadClient = (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'index.html'));
};

router.use('/api', apiRouter);

// Everything not already defined will return the client
router.get('/*', loadClient);

export const rootRouter = router;
