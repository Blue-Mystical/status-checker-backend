import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "../models/UserModel.js";
 
const { DataTypes } = Sequelize;

const Withdrawals = db.define('withdrawals',{
    withdrawal_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    doc_date:{
        type: DataTypes.DATE,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('waiting_for_document', 'modifying_document', 'proposing_approval',
        'approving', 'saving_into_system', 'sending', 'withdrawing')
    },
    amount:{
        type: DataTypes.DECIMAL(14,2),
        allowNull: false
    },
},{
    freezeTableName:true
}
);

Users.hasMany(Withdrawals, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
  });
Withdrawals.belongsTo(Users, {
    foreignKey: 'user_id',
});

(async () => {
    await db.sync();
})();
 
export default Withdrawals;