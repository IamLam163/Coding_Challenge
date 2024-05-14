// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
/*
export default async (req, res) => {
  res.sendStatus(500);
}
*/

import sequelize from "../../db";
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";
import playerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  try {
    await sequelize.authenticate();
    const players = await Player.findAll({
      include: [
        {
          model: PlayerSkill,
          as: "playerSkills"
        }
      ]
    });
    res.status(200).json({
      message: "Congratulations, players list retrieved successfully:",
      players
    });
  } catch (error) {
    console.error("Error getting players:", error);
    res.status(500).json({
      message: "An Error occured when getting players",
      error: error.message
    });
  }
};
