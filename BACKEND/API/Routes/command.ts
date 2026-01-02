import { Router, Request, Response } from "express";

const router = Router();

// send a command request
router.post("/", (req: Request, res: Response) => {
  res.sendStatus(501); // Not implemented
});

// retrieve a command's info
router.get("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// update a command
router.patch("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// delete a command
router.delete("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

// create a new command
router.put("/", (req: Request, res: Response) => {
  res.sendStatus(501);
});

export default router;
