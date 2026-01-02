import { Router, Request, Response } from "express";

const router = Router();

// authenticate a user
router.post("/", (req: Request, res: Response) => {
  res.sendStatus(501); // Not implemented
});

// retrieve a user's info
router.get("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// update a user
router.patch("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// delete a user
router.delete("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// create a new user
router.put("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

export default router;
