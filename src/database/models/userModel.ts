import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
    tableName: 'users',
    modelName: 'User',
    timestamps: true
})

class User extends Model {
    @Column({
        primaryKey : true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id:string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare username: string


    @Column({
        type: DataType.STRING,
        
    })
    declare password: string

    @Column({
        type:DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare email:string
    
    @Column({
        type:DataType.ENUM('teacher','institute','super-admin','student','visitor'),
        allowNull: false,
        defaultValue:'visitor'
    })
    declare role:string
   
    @Column({
        type:DataType.STRING
    })
    declare currentInstituteNumber:string

}

export default User