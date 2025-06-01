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
        allowNull: false
    })
    declare password: string

    @Column({
        type:DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare email:string
    
    @Column({
        type:DataType.ENUM('teacher','institute','super-admin','student'),
        allowNull: false,
        defaultValue:'student'
    })
    declare role:string

}

export default User