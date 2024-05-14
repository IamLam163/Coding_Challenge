// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import sequelize from "../../db";
//import Team from "../../db/model/team";
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  try {
    await sequelize.authenticate();
    const requirements = req.body;

    if (!Array.isArray(requirements)) {
      return res
        .status(400)
        .json({ message: "Invalid format for team requirements" });
    }

    const selectedPlayers = [];

    for (const requirement of requirements) {
      const { position, mainSkill, numberOfPlayers } = requirement;

      // Find players for the position
      const players = await Player.findAll({
        where: { position },
        include: {
          model: PlayerSkill,
          as: "playerSkills"
        }
      });

      // Filter by main skill if provided
      let playersWithMainSkill = players;
      if (mainSkill) {
        playersWithMainSkill = players.filter((player) =>
          player.playerSkills.some((skill) => skill.skill === mainSkill)
        );
      }

      // Check if enough players with main skill are found
      if (playersWithMainSkill.length >= numberOfPlayers) {
        // Select the required number of players with the main skill
        selectedPlayers.push(
          ...playersWithMainSkill.slice(0, numberOfPlayers).map((player) => ({
            name: player.name,
            position: player.position,
            playerSkills: player.playerSkills
          }))
        );
        continue; // Move to the next requirement
      }

      // If not enough players with main skill, use all and fill the rest with best by any skill
      const remainingPlayers = numberOfPlayers - playersWithMainSkill.length;

      // Get all players for the position (including those without the main skill)
      const playersByPosition = await Player.findAll({
        where: { position },
        include: {
          model: PlayerSkill,
          as: "playerSkills"
        }
      });

      // Check if there are enough players overall
      if (playersByPosition.length < numberOfPlayers) {
        return res.status(400).json({
          message: `Insufficient number of players for position: ${position}`
        });
      }

      // Sort and select the best remaining players based on their highest skill value
      const bestPlayers = playersByPosition
        .sort((a, b) => {
          const bestSkillA = Math.max(
            ...a.playerSkills.map((skill) => skill.value)
          );
          const bestSkillB = Math.max(
            ...b.playerSkills.map((skill) => skill.value)
          );
          return bestSkillB - bestSkillA;
        })
        .slice(playersWithMainSkill.length, numberOfPlayers);

      // Combine players with main skill and best remaining players
      selectedPlayers.push(
        ...playersWithMainSkill.map((player) => ({
          name: player.name,
          position: player.position,
          playerSkills: player.playerSkills
        })),
        ...bestPlayers.map((player) => ({
          name: player.name,
          position: player.position,
          playerSkills: player.playerSkills
        }))
      );
    }

    res.status(200).json({ selectedPlayers });
  } catch (error) {
    console.error("Error processing team:", error);
    res.status(500).json({
      message: "An Error occured when processing team",
      error: error.message
    });
  }
};
