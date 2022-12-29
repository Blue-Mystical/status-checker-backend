import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";

export const FetchUsers = async (req, res) => {
  try {
    // get all registered users
    const users = await Users.findAll({
      raw: true,
      where: {
        [Op.or]: [
          Sequelize.where(Sequelize.fn("lower", Sequelize.col("email")), {
            [Op.like]: "%" + req.query.query + "%",
          }),
          Sequelize.where(Sequelize.fn("lower", Sequelize.col("member_id")), {
            [Op.like]: "%" + req.query.query + "%",
          }),
          Sequelize.where(Sequelize.fn("lower", Sequelize.col("first_name")), {
            [Op.like]: "%" + req.query.query + "%",
          }),
          Sequelize.where(Sequelize.fn("lower", Sequelize.col("last_name")), {
            [Op.like]: "%" + req.query.query + "%",
          }),
        ],
      },
      attributes: [
        "user_id",
        "name_title",
        "first_name",
        "last_name",
        "email",
        "member_id",
        "user_type",
        "academic_rank",
        "department",
        "faculty",
        // "advisor",
      ],
    });
    // return user info
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const GetCurrentUser = async (req, res) => {
  try {
    // get specific user
    const user = await Users.findOne({
      where: {
        user_id: req.user_id,
      },
      attributes: [
        "name_title",
        "first_name",
        "last_name",
        "email",
        "member_id",
        "user_type",
        "academic_rank",
        "department",
        "faculty",
        // "advisor",
      ],
    });
    // return user info
    // console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const UpdateUser = async (req, res) => {
  try {
    // find a user by user id
    const user = await Users.findOne({
      where: {
        user_id: req.params.id
      },
    });
    if (!user)
      return res.status(404).json({msg: "ไม่พบผู้ใช้ที่ต้องการ"});

    const userId = user.user_id;

    if (req.body.member_id === '') req.body.member_id = null;
    if ((user.user_type === "admin" && req.body.user_type !== "admin") && req.user_id == req.params.id) 
        return res.status(403).json({msg: "ไม่สามารถแก้ไขสถานะของสมาชิกตัวเองให้เป็น non-admin"});

    // update chosen user
    const UpdatedUser = await Users.update(
      {
        name_title: req.body.name_title,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        user_type: req.body.user_type,
        academic_rank: req.body.academic_rank,
        member_id: req.body.member_id,
        department: req.body.department,
        faculty: req.body.faculty,
        // course: req.body.course,
        // advisor: req.body.advisor,
      },
      {
        where: {
            user_id: req.params.id,
        },
      }
    );
    if (!UpdatedUser) return res.status(404).json({msg: "ไม่พบผู้ใช้ที่ต้องการ"});
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "ไม่สามารถแก้ไขรายการ" });
    console.log(error);
  }
};

export const DeleteUser = async (req, res) => {
    try {
      // find a user by user id
      const user = await Users.findOne({
        where: {
          user_id: req.params.id
        },
      });
      if (!user)
        return res.status(404).json({msg: "ไม่พบผู้ใช้ที่ต้องการ"});
  
      const userId = user.user_id;
  
      if ((user.user_type === "admin") && req.user_id == req.params.id) 
          return res.status(403).json({msg: "ไม่สามารถลบสมาชิกที่เป็น admin"});
  
      // delete chosen user
      const DeletedUser = await Users.destroy(
        {
          where: {
              user_id: req.params.id,
          },
        }
      );
      if (!DeletedUser) return res.status(404).json({msg: "ไม่พบผู้ใช้ที่ต้องการ"});
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ msg: "ไม่สามารถลบรายการ" });
      console.log(error);
    }
  };

  export const AddUser = async (req, res) => {
    const {
      name_title,
      first_name,
      last_name,
      email,
      member_id,
      password,
      password_confirm,
      department,
      faculty,
      academic_rank,
      // advisor,
      user_type
    } = req.body;
  
    let var_member_id = member_id
    if (member_id === '') var_member_id = null;
    if (password !== password_confirm)
      return res.status(400).json({ msg: "รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
  
    try {
      await Users.create({
        name_title: name_title,
        first_name: first_name,
        last_name: last_name,
        email: email,
        member_id: var_member_id, // UNIQUE BUT CAN BE NULL
        department: department,
        faculty: faculty,
        // course: course,
        // advisor: advisor,
        user_type: user_type,
        academic_rank: academic_rank,
        password: hashPassword,
      });
      res.status(200).json({ msg: "การเพิ่มสมาชิกสมบูรณ์" });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ msg: "มีอีเมลหรือรหัสนักศึกษาที่ซ้ำกันอยู่แล้ว" });
      } else {
        console.log(error);
        return res.status(400).json({ msg: "ไม่สามารถเพิ่มสมาชิก อาจจะมีอีเมลหรือรหัสผู้ใช้งานซ้ำกัน" });
      }
    }
  };

export const Register = async (req, res) => {
  const {
    name_title,
    first_name,
    last_name,
    email,
    member_id,
    password,
    password_confirm,
    department,
    faculty,
    // course,
    // advisor,
    user_type,
    academic_rank,
  } = req.body;
  let var_member_id = member_id
  if (member_id === '') var_member_id = null;
  if (password !== password_confirm)
    return res.status(400).json({ msg: "รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน" });
  if (user_type === "admin")
    return res.status(403).json({ msg: "ไม่สามารถกำหนดผู้ใช้ให้เป็น admin ได้" });
  if (user_type === 'student') {
    if (member_id === "") 
      return res.status(400).json({ msg: "รหัสนักศึกษาไม่ถูกต้องตามเกณฑ์" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  console.log(name_title);
  try {
    await Users.create({
      name_title: name_title,
      first_name: first_name,
      last_name: last_name,
      email: email,
      member_id: var_member_id,
      department: department,
      faculty: faculty,
      // course: course,
      // advisor: advisor,
      user_type: user_type,
      academic_rank: academic_rank,
      password: hashPassword,
    });
    console.log("Success reg");
    res.json({ msg: "การลงทะเบียนเสร็จสมบูรณ์" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ msg: "มีอีเมลหรือรหัสนักศึกษาที่ซ้ำกันอยู่แล้ว" });
    } else {
      console.log(error);
      return res.status(400).json({ msg: "ไม่สามารถลงทะเบียนผู้ใช้งาน อาจจะมีอีเมลหรือรหัสผู้ใช้งานซ้ำกัน" });
    }
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.eq]: req.body.input } },
          { member_id: { [Op.eq]: req.body.input } },
        ],
      },
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "รหัสผิดพลาด" });
    const userId = user.user_id;
    const email = user.email;
    const accessToken = jwt.sign(
      { userId, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const refreshToken = jwt.sign(
      { userId, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          user_id: userId,
        },
      }
    );
    // console.log(refreshToken)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "ไม่มีบัญชีอยู่ในระบบ" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user) return res.sendStatus(204);
  const userId = user.user_id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        user_id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
