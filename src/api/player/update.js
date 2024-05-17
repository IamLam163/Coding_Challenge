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
  const { id } = req.params;
  const { name, position, playerSkills } = req.body;

  if (!id || typeof id !== "string" || !name || typeof name !== "string") {
    return res.status(422).json({ message: "Invalid player id or name" });
  }

  try {
    const player = await Player.findByPk(id, {
      include: [
        {
          model: PlayerSkill,
          as: "playerSkills"
        }
      ]
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found!" });
    }

    await sequelize.transaction(async (t) => {
      player.name = name;

      if (position && typeof position === "string") {
        player.position = position;
      }

      await player.save({ transaction: t });

      if (playerSkills && Array.isArray(playerSkills)) {
        const savePromises = playerSkills.map(async (skill) => {
          if (skill.id) {
            console.log(
              `Updating skill id: ${skill.id} with value: ${skill.value}`
            );
            const playerSkill = await PlayerSkill.findByPk(skill.id);
            if (playerSkill) {
              playerSkill.value = skill.value;
              if (skill.skill) {
                playerSkill.skill = skill.skill; // corrected to update the skill name
              }
              return playerSkill.save({ transaction: t });
            }
          }
        });

        await Promise.all(savePromises);
      }
    });

    const updatedPlayer = await Player.findByPk(id, {
      include: [
        {
          model: PlayerSkill,
          as: "playerSkills"
        }
      ]
    });

    res.status(200).json({
      message: "Congratulations, player updated successfully",
      player: updatedPlayer
    });
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({
      message: "An Error occurred when updating player",
      error: error.message
    });
  }
};

/*
export default async (req, res) => {
  try {
    //await sequelize.authenticate();
    const { id } = req.params;
    const { name, position, playerSkills } = req.body;

    if (!id || typeof id !== "string" || !name || typeof name !== "string") {
      return res.status(422).json({ message: "Invalid player id or name" });
    }

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

      if (position && typeof position === "string") {
        player.position = position;
      }

      if (playerSkills && Array.isArray(playerSkills)) {
        await Promise.all(
          playerSkills.map(async (skill) => {
            if (skill.id) {
              console.log(
                `Updating skill id: ${skill.id} with value: ${skill.value}`
              );
              try {
                const playerSkill = await PlayerSkill.findByPk(skill.id);
                if (playerSkill) {
                  playerSkill.value = skill.value;
                  await playerSkill.save();
                }
              } catch (error) {
                console.error(`Error updating skill id: ${skill.id}`, error);
              }
            }
          })
        );
      }

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
*/
