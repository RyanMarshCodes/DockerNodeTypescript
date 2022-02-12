import { User } from './user.model';
import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import Sequelize from 'sequelize';

@Table
export class Token extends Model {
    @ForeignKey(() => User)
    @Column({
        type: Sequelize.STRING,
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @Column({
        type: Sequelize.STRING(20),
    })
    tokenType: string;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    accessToken: string;

    @Column({
        type: Sequelize.TEXT({ length: 'long' }),
    })
    refreshToken: string;

    @Column({
        type: Sequelize.DATE,
    })
    expires: Date;
}
