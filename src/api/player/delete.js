// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import sequelize from "../../db";
import Player from "../../db/model/player";
import PlayerSkill from "../../db/model/playerSkill";
import { expressjwt } from "express-jwt";
import dotenv from "dotenv";
import authenticateToken from "./utils";
/*
export default async (req, res) => {
  res.sendStatus(500);
}
*/

dotenv.config();
const secret = process.env.SECRET_KEY;

//const jwtMiddleware = expressjwt({ secret: secret, algorithms: ["HS256"] });

export default async (req, res) => {
  authenticateToken(req, res, async () => {
    try {
      await sequelize.authenticate();
      const { id } = req.params;
      const player = await Player.findByPk(id);
      if (!player) {
        res.status(404).json({ message: "Player not found!" });
      } else {
        await PlayerSkill.destroy({ where: { id } });
        await Player.destroy({ where: { id } });
        res.status(200).json({ message: "Player deleted successfully!" });
      }
    } catch (error) {
      console.error("Error deleting player:", error);
      res.status(500).json({
        message: "An Error occured when deleting player",
        error: error.message
      });
    }
  });
};
