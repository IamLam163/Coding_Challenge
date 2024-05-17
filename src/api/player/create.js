// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import sequelize from "../../db";
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  const { name, position, playerSkills } = req.body;
  try {
    const player = await Player.create({ name, position });
    const skills = PlayerSkill.bulkCreate(
      playerSkills.map((skill) => ({
        skill: skill.skill,
        value: skill.value,
        playerId: player.id
      }))
    );
    //createdPlayer = { name, position, playerSkills: skills };
    const createdPlayer = await Player.findOne({
      where: { id: player.id },
      include: { model: PlayerSkill, as: "playerSkills" }
    });
    res
      .status(201)
      .json({ message: "Players created successfully!", createdPlayer });
  } catch (error) {
    console.error("Error creating players:", error);
    res.status(500).json({
      message: "An error occurred when creating players",
      error: error.message
    });
  }
};
