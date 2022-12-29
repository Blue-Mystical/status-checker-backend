import { Sequelize } from "sequelize";
 
const db = new Sequelize('withdraw_checker', 'root', '', {
    host: "localhost",
    port: "3307",
    dialect: "mysql",
    define: {
      timestamps: false
    }
});

db.authenticate()
  .then(function(){
    console.log("Database connection successful");
  })
  .catch(function(error){
    console.log("Error: " + error);
});
 
export default db;