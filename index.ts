import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to login or create a new user
app.post("/api/users", async (req: Request, res: Response) => {
  const { username } = req.body;
  let user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    user = await prisma.user.create({ data: { username } });
  }
  res.json(user);
});

// Endpoint to handle clicks (increments points by clickPower)
app.post("/api/click", async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const updatedUser = await prisma.user.update({
    where: { username },
    data: { points: { increment: user.clickPower } },
  });
  res.json(updatedUser);
});

// Endpoint to upgrade click power
app.post("/api/upgrade", async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const updatedUser = await prisma.user.update({
    where: { username },
    data: { clickPower: { increment: 1 } },
  });
  res.json(updatedUser);
});

// Endpoint to unlock auto-clicker feature
app.post("/api/unlock-auto-clicker", async (req: Request, res: Response) => {
    const { username } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await prisma.user.update({
        where: { username },
        data: { unlockedAutoClicker: true },
    });
    res.json(updatedUser);
});
app.listen(3001, () => console.log("API server running on http://localhost:3001"));
