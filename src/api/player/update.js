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

export default async (req, res) => {
  try {
    await sequelize.authenticate();
    const { id } = req.params;
    const { name } = req.body;

    const player = await Player.findByPk(id, {
      include: [
        {
          model: PlayerSkill,
          as: "playerSkills"
        }
      ]
    });
    if (!player) {
      res.status(404).json({ message: "Player not found!" });
    } else {
      player.name = name;
      await player.save();
      res.status(200).json({
        message: "Congratulations, player updated successfully:",
        player
      });
    }
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({
      message: "An Error occured when updating player",
      error: error.message
    });
  }
};
