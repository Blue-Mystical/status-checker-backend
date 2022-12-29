import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users',{
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name_title:{
        type: DataTypes.ENUM('mr', 'mrs', 'miss', 'none'),
    },
    first_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    academic_rank:{
        type: DataTypes.ENUM('professor', 'associate_professor', 'assistant_professor', 'none'),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    user_type:{
        type: DataTypes.ENUM('student', 'staff', 'lecturer', 'admin'),
        allowNull: false
    },
    department:{
        type: DataTypes.STRING,
    },
    faculty:{
        type: DataTypes.STRING,
    },
    member_id:{
        type: DataTypes.STRING,
        unique: true
    },
    // course:{
    //     type: DataTypes.STRING
    // },
    // advisor:{
    //     type: DataTypes.STRING
    // },
    register_date:{
        type: DataTypes.DATE
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
}
);
 
(async () => {
    await db.sync();
})();
 
export default Users;