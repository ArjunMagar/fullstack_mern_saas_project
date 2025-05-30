import { Sequelize } from 'sequelize-typescript'
import { dbConfig } from '../config/config'



const sequelize = new Sequelize({
    database: dbConfig.db,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    models: [__dirname + '/models'],
    pool: {
        min: dbConfig.pool.min,
        max: dbConfig.pool.max,
        idle: dbConfig.pool.idle,
        acquire: dbConfig.pool.acquire
    },

})

sequelize.authenticate().then(() => {
    console.log("Authenticated, connected")
})
.catch((err) => {
        console.log(err)
    })

//migrate garnu parxa / push garnu parxa
sequelize.sync({ force: false }).then(() => {
    console.log("migrated successfully new changes")
})

export default sequelize


