import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/authenticate";
import prisma from "../config/prisma";

const router = Router();

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

export default router;
