// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// ---------------------------------------------------------------------------------------------

import Sequelize from "sequelize";
import database from "../index";
import Player from "./player";

const PlayerSkill = database.define(
  "playerSkill",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    skill: {
      type: Sequelize.STRING(200),
      allowNull: false,
      validate: {
        isIn: [["defense", "attack", "speed", "strength", "stamina"]]
      }
    },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    playerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Player,
        key: "id"
      }
    }
  },
  {
    timestamps: false
  }
);

PlayerSkill.associate = (models) => {
  models.PlayerSkill.belongsTo(models.Player, {
    foreignKey: "playerId",
    as: "player"
  });
};

export default PlayerSkill;
