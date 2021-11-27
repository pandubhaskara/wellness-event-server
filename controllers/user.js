const { users } = require("../models")
const { encrypt, checkPass } = require("../middlewares/bcrypt");
const jwt = require("../middlewares/jwt");
const Joi = require("joi")

module.exports = {
  register: async (req, res) => {
    const body = req.body;
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.string().required()
      });

      const { error } = schema.validate(
        {
          username: body.username,
          password: body.password,
          name: body.name,
          role: body.role
        },
        { abortEarly: false }
      );
      if (error) {
        return res.status(400).json({
          status: "failed",
          message: "Bad Request",
          errors: error["details"][0]["message"],
        });
      }

      const user = await users.create({
        username: body.username,
        password: encrypt(body.password),
        name: body.name,
        role: body.role
      });
      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "Unable to save the data to database",
          data: null
        });
      }

      return res.status(200).send({
        status: "Success",
        message: "successfully registered",
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
        data: null,
      });
    }
  },
  login: async (req, res) => {
    const body = req.body;
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      });

      const check = schema.validate({ ...body }, { abortEarly: false });

      if (check.error) {
        return res.status(400).json({
          status: "failed",
          message: "Bad Request",
          errors: check.error["details"].map(({ message }) => message),
        });
      }

      const user = await users.findOne({
        where: {
          username: body.username,
        },
      });

      if (!user) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid email",
          data: null
        });
      }

      const checkPassword = checkPass(body.password, user.dataValues.password);

      if (!checkPassword) {
        return res.status(401).json({
          status: "failed",
          message: "Invalid Password",
          data: null
        });
      }
      const payload = {
        id: user.dataValues.id,
        username: user.dataValues.username,
        role: user.dataValues.role
      };

      const token = jwt.generateToken(payload);

      return res.status(200).json({
        status: "success",
        message: "Login successfully",
        token: token,
      });

    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
        data: null
      });
    }
  },
  getDetail: async (req, res) => {
    const user = req.user;
    try {
      const userData = await users.findOne({
        where: { id: user.id },
      });

      if (!userData) {
        return res.status(400).json({
          status: "failed",
          message: "Data not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Succesfully retrieved data User",
        data: userData,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
        data: null,
      });
    }
  },
}