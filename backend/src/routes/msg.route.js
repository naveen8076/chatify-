import express from "express";

const router = express.Router();

router.get("/send", (req, res) => {
    res.send("how are you");
});

export default router