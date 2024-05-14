/*
import express from "express";
//yer/utils.js";
import { Player } from "../../db/model/player"; // Ensure correct import of your models
import sequelize from "../../db"; // Import your sequelize instance

//const router = express.Router();
import app from "../../api";

export default peace = async (req, res) => {
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

      const players = await Player.findAll({
        where: { position },
        include: {
          model: PlayerSkill,
          as: "playerSkills",
          where: { skill: mainSkill },
          required: false
        }
      });

      // If no players found with the desired skill, find the best by any skill
      if (players.length < numberOfPlayers) {
        const playersByPosition = await Player.findAll({
          where: { position },
          include: {
            model: PlayerSkill,
            as: "playerSkills"
          }
        });

        if (playersByPosition.length < numberOfPlayers) {
          return res.status(400).json({
            message: `Insufficient number of players for position: ${position}`
          });
        }

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
          .slice(0, numberOfPlayers);

        selectedPlayers.push(
          ...bestPlayers.map((player) => ({
            name: player.name,
            position: player.position,
            playerSkills: player.playerSkills
          }))
        );
      } else {
        const bestPlayers = players
          .sort((a, b) => {
            const skillA = a.playerSkills.find(
              (skill) => skill.skill === mainSkill
            ).value;
            const skillB = b.playerSkills.find(
              (skill) => skill.skill === mainSkill
            ).value;
            return skillB - skillA;
          })
          .slice(0, numberOfPlayers);

        selectedPlayers.push(
          ...bestPlayers.map((player) => ({
            name: player.name,
            position: player.position,
            playerSkills: player.playerSkills
          }))
        );
      }
    }

    res.status(200).json(selectedPlayers);
  } catch (error) {
    console.error("Error processing team selection:", error);
    res.status(500).json({
      message: "An error occurred when processing team selection",
      error: error.message
    });
  }
};
*/
//export default router;

/*
import sequelize from "sequelize";
import database from "../models/index";

const Team = database.define(
  "team",
  {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    position: {
      type: sequelize.STRING(200)
    },
    mainSkill: {
      type: sequelize.STRING(200)
    },
    numberOfPlayers: {
      type: sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
);

Team.associate = (models) => {
  models.Team.hasMany(models.Player, {
    foreignKey: "teamId",
    as: "thePlayers",
    onDelete: "CASCADE"
  });
};

export default Team;
*/
