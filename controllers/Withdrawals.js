import Users from "../models/UserModel.js";
import Withdrawals from "../models/WithdrawalModel.js";
import { Op, Sequelize } from "sequelize";

export const GetWithdrawal = async (req, res) => {
  try {
    // get specific withdrawal
    const withdrawal = await Withdrawals.findOne({
      where: {
        withdrawal_id: req.params.id,
      },
      include: [
        {
          model: Users,
          attributes: [
            "name_title",
            "first_name",
            "last_name",
            "user_type",
            "member_id",
            "department",
            "faculty",
            // "advisor",
          ],
        },
      ],
    });
    if (!withdrawal) return res.status(404).json({msg: "ไม่พบรายการที่ต้องการ"});
    // return user info
    res.json({ withdrawal });
  } catch (error) {
    res.status(500).json({ msg: "เกิดปัญหาในระหว่างการดึงข้อมูล" });
    console.log(error);
  }
};

export const FetchWithdrawals = async (req, res) => {
  console.log(req.query.query);
  try {
    // get all withdrawals basen on query
    const withdrawals = await Withdrawals.findAll({
      raw: true,
      include: [
        {
          model: Users,
          where: {
            [Op.or]: [
              Sequelize.where(Sequelize.fn("lower", Sequelize.col("email")), {
                [Op.like]: "%" + req.query.query + "%",
              }),
              Sequelize.where(
                Sequelize.fn("lower", Sequelize.col("member_id")),
                {
                  [Op.like]: "%" + req.query.query + "%",
                }
              ),
              Sequelize.where(
                Sequelize.fn("lower", Sequelize.col("first_name")),
                {
                  [Op.like]: "%" + req.query.query + "%",
                }
              ),
              Sequelize.where(
                Sequelize.fn("lower", Sequelize.col("last_name")),
                {
                  [Op.like]: "%" + req.query.query + "%",
                }
              ),
              // { email: {[Op.like] : "%" + req.query.query + "%"} },
              // { member_id: {[Op.like] : "%" + req.query.query + "%"} },
              // { first_name: {[Op.like] : "%" + req.query.query + "%"} },
              // { last_name: {[Op.like] : "%" + req.query.query + "%"} },
            ],
          },
        },
      ],
    });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ msg: "เกิดปัญหาในระหว่างการดึงข้อมูล" });
    console.log(error);
  }
};

export const GetCurrentUserWithdrawals = async (req, res) => {
  try {
    // get all withdrawals from the current user
    const withdrawals = await Withdrawals.findAll({
      where: {
        user_id: req.user_id,
      },
      raw: true,
    });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ msg: "เกิดปัญหาในระหว่างการดึงข้อมูล" });
    console.log(error);
  }
};

export const InsertWithdrawal = async (req, res) => {
  try {
    // find a user based on member id or email
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.eq]: req.body.input } },
          { member_id: { [Op.eq]: req.body.input } },
        ],
      },
    });
    if (!user)
      return res.status(404).json({msg: "ไม่พบผู้ใช้ที่ตรงกับอีเมลหรือรหัสนักศึกษาที่กรอกเข้าไป"});
    const userId = user.user_id;

    // insert a withdrawal
    await Withdrawals.create({
      user_id: userId,
      description: req.body.description,
      doc_date: req.body.doc_date,
      status: req.body.status,
      amount: req.body.amount,
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "ไม่สามารถสร้างรายการ" });
    console.log(error);
  }
};

export const UpdateWithdrawal = async (req, res) => {
  try {
    // find a user based on member id or email
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.eq]: req.body.input } },
          { member_id: { [Op.eq]: req.body.input } },
        ],
      },
    });
    if (!user)
      return res.status(404).json({msg: "ไม่พบผู้ใช้ที่ตรงกับอีเมลหรือรหัสนักศึกษาที่กรอกเข้าไป"});
    const userId = user.user_id;

    // update chosen withdrawal
    const withdrawal = await Withdrawals.update(
      {
        user_id: userId,
        description: req.body.description,
        doc_date: req.body.doc_date,
        status: req.body.status,
        amount: req.body.amount,
      },
      {
        where: {
          withdrawal_id: req.params.id,
        },
      }
    );
    if (!withdrawal) return res.status(404).json({msg: "ไม่พบรายการที่ต้องการ"});
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "ไม่สามารถแก้ไขรายการ" });
    console.log(error);
  }
};

export const UpdateWithdrawalStatus = async (req, res) => {
  try {
    // update only status
    const withdrawal = await Withdrawals.update(
      { status: req.body.new_status },
      {
        where: {
          withdrawal_id: req.params.id,
        },
      }
    );
    if (!withdrawal) return res.status(404).json({msg: "ไม่พบรายการที่ต้องการ"});
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "ไม่สามารถแก้ไขรายการ" });
    console.log(error);
  }
};

export const DeleteWithdrawal = async (req, res) => {
  try {
    // delete chosen withdrawal
    const withdrawal = await Withdrawals.destroy({
      where: {
        withdrawal_id: req.params.id,
      },
    });
    if (!withdrawal) return res.status(404).json({msg: "ไม่พบรายการที่ต้องการ"});
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "ไม่สามารถลบรายการ" });
    console.log(error);
  }
};
