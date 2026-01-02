import { Router, Request, Response } from "express";

const router = Router();

// retrieve a family's info
router.get("/", (req: Request, res: Response) => {
  res.sendStatus(501); // Not implemented
});

// update a family
router.patch("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// delete a family
router.delete("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// create a new family
router.put("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

export default router;
