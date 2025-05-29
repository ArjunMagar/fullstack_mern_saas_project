import {Sequelize} from 'sequelize'
import { dbConfig } from '../config/config'



const sequelize = new Sequelize(dbConfig.db,dbConfig.username,dbConfig.password,{
    host : dbConfig.host,
    dialect : dbConfig.dialect,
    port : dbConfig.port,
    pool : {
        min : dbConfig.pool.min,
        max : dbConfig.pool.max,
        idle : dbConfig.pool.idle,
        acquire : dbConfig.pool.acquire
    }
})

sequelize.authenticate().then(()=>{
    console.log("Database Connected")
})
.catch((err)=>{
    console.log(err)
})

export default sequelize


