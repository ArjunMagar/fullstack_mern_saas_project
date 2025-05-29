
export enum Dialect {
    MYSQL = 'mysql',
    POSTGRES = 'postgres',
    SQLITE = 'sqlite',
    MARIADB = 'mariadb',
    MSSQL = 'mssql'
}
export interface DBPoolConfig {
    min: number,
    max: number,
    idle: number,
    acquire: number
}
export interface DBConfig {
    db: string,
    host: string,
    username: string,
    password: string,
    dialect: Dialect
    port: number,
    pool: DBPoolConfig
}