import { Column, Model, Table } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import Sequelize from "sequelize";

@Table
export class Report extends Model {
    @Column({
        type: Sequelize.STRING,
        primaryKey: true,
    })
    code: string;

    @Column({
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    })
    guid: typeof uuid;

    @Column({
        type: Sequelize.STRING,
    })
    title: string;

    @Column({
        type: Sequelize.STRING,
    })
    type: string;

    @Column({
        type: Sequelize.TEXT({ length: "long" }),
    })
    data: string;
}
