import { Table, Column, Model } from 'sequelize-typescript';
import Sequelize from 'sequelize';
// import { DataTypes } from 'sequelize/types';
import { v4 as uuid } from 'uuid';

@Table({
    modelName: 'LogEntry',
    createdAt: 'requestStart',
    updatedAt: false,
})
export class LogEntry extends Model {
    @Column({
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    })
    id: BigInt;

    @Column({
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    })
    guid: typeof uuid;

    /**
     * Request Properties (IP, Body, Headers, etc.)
     */
    @Column({
        type: Sequelize.DATE,
    })
    requestStart: Date;

    @Column({
        type: Sequelize.STRING,
    })
    requestRemoteAddr: string;

    @Column({
        type: Sequelize.STRING,
    })
    requestMethod: string;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    requestUrl: string;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    requestBody: string;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    requestHeaders: string;

    /**
     * Response Properties (End Time, Body, Headers)
     */
    @Column({
        type: Sequelize.DATE,
    })
    responseFinish: Date;

    @Column({
        type: Sequelize.INTEGER,
        allowNull: false,
    })
    responseStatus: number;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    responseBody: string;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    responseHeaders: string;

    @Column({
        type: Sequelize.DATE,
    })
    responseClose: Date;

    @Column({
        type: Sequelize.INTEGER,
    })
    totalResponseTime: number;
}
