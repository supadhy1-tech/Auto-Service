import { Router } from 'express';
import jwt from 'jsonwebtoken';


const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});


export default router;
