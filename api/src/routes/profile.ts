import middleware from '@blocklet/sdk/lib/middlewares';
import bodyParser from 'body-parser';
import { Router } from 'express';
import { profileService } from '../services/profile';

// Assume the logged-in user's ID is this
const ASSUMED_USER_ID = '8888888888';
const router = Router();

router.use(middleware.user(), bodyParser.json());

router.get('/profile', async (_req, res) => {
  const id = /* req.user?.did ?? */ ASSUMED_USER_ID;
  const result = await profileService.findOne(id);

  res.json(result);
});

router.put('/profile', async (req, res) => {
  const id = /* req.user?.did ?? */ ASSUMED_USER_ID;

  await profileService.update(id, req.body);

  res.json({
    success: true,
  });
});

export { router };
