import sequelize from "../../db";
import Team from "../../db/model/team";
import Player from "../../db/model/player";
import express from "express";

const router = express.Router();

/*
router.post("/create", async (req, res) => {
  try {
    await sequelize.authenticate();
    const { position, mainSkill, numberOfPlayers } = req.body;
    const team = await Team.create({ position, mainSkill, numberOfPlayers });

    res.status(201).json({ message: "Team created successfully!", team });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({
      message: "An Error occured when creating team",
      error: error.message
    });
  }
});
*/
//export default router;
