// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import sequelize from "../../db";
//import Team from "../../db/model/team";
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  const requirements = req.body;

  try {
    const totalPlayers = await Player.count();
    if (
      requirements.reduce((sum, req) => sum + req.numberOfPlayers, 0) >
      totalPlayers
    ) {
      return res.status(400).json({
        message: "Insufficient number of players to meet the requirements"
      });
    }

    const selectedPlayers = [];

    for (const req of requirements) {
      const { position, mainSkill, numberOfPlayers } = req;

      // Fetch players based on the position
      let players = await Player.findAll({
        where: { position },
        include: {
          model: PlayerSkill,
          as: "playerSkills",
          required: false,
          attributes: { exclude: ["id", "playerId"] }
        },
        attributes: { exclude: ["id"] }
      });

      if (players.length < numberOfPlayers) {
        return res.status(400).json({
          message: `Insufficient number of players for position: ${position}`
        });
      }

      players = players
        .map((player) => {
          const mainSkillValue = player.playerSkills.find(
            (s) => s.skill === mainSkill
          )?.value;
          const highestSkillValue = Math.max(
            ...player.playerSkills.map((s) => s.value)
          );
          const playerData = player.get();
          // delete playerData.mainSkillValue;
          return {
            ...playerData,
            playerSkills: player.playerSkills,
            mainSkillValue: mainSkillValue || highestSkillValue
          };
        })
        .sort((a, b) => b.mainSkillValue - a.mainSkillValue)
        .slice(0, numberOfPlayers)
        .map((player) => {
          delete player.mainSkillValue; // Remove mainSkillValue from the player data
          return player;
        });
      selectedPlayers.push(...players);
    }

    res.status(200).json(selectedPlayers);
  } catch (error) {
    console.error("Error selecting team:", error);
    res.status(500).json({
      message: "An error occurred when selecting the team",
      error: error.message
    });
  }
};
