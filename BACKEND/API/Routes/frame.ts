import { Router, Request, Response } from "express";

const router = Router();

// analyze a frame
router.post("/", (req: Request, res: Response) => {
  res.sendStatus(501); // Not implemented
});

export default router;
