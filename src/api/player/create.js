// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import sequelize from "../../db";
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";

export default async (req, res) => {
  try {
    await sequelize.authenticate();
    const playersData = req.body;
    const players = [];

    await Promise.all(
      playersData.map(async (playerData) => {
        const { name, position, playerSkills } = playerData;
        const player = await Player.create({ name, position });

        await Promise.all(
          playerSkills.map(async (skill) => {
            await PlayerSkill.create({
              id: skill.id,
              skill: skill.skill,
              value: skill.value,
              playerId: player.id
            });
          })
        );

        players.push(player);
      })
    );

    res.status(201).json({ message: "Players created successfully!", players });
  } catch (error) {
    console.error("Error creating players:", error);
    res.status(500).json({
      message: "An error occurred when creating players",
      error: error.message
    });
  }
};

/*

Takes too much time for bulk creation
export default async (req, res) => {
  try {
    const players = [];
    const playerSkills = [];
    const transaction = await sequelize.transaction();

    for (const playerData of req.body) {
      const { name, position, playerSkills: skills } = playerData;
      const player = await Player.create({ name, position }, { transaction });
      players.push(player);

      const skillsToCreate = skills.map((skill) => ({
        skill: skill.skill,
        value: skill.value,
        playerId: player.id
      }));
      playerSkills.push(...skillsToCreate);
    }

    await PlayerSkill.bulkCreate(playerSkills, { transaction });

    await transaction.commit();
    res.status(201).json({ message: "Players created successfully!", players });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating players:", error);
    res.status(500).json({
      message: "An error occurred when creating players",
      error: error.message
    });
  }
};
*/

/*
export default async (req, res) => {
  res.sendStatus(500);
}
*/

/**   
 async function createPlayer(playerData) {
  try {
  const { name, position, playerSkills } = playerData;
  const player = await Player.create({ name, position });

  await Promise.all(
    playerSkills.map(async (skill) => {
      await PlayerSkill.create({
        id: skill.id,
        skill: skill.skill,
        value: skill.value,
        playerId: player.id
      });
    })
  );
  res.status(201).json({ message: "Players created successfully!", player });
} catch (error) {
  console.error("Error creating players:", error);
}

return player;
 */
