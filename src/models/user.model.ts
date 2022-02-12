import { Table, Column, Model, HasOne, HasMany } from "sequelize-typescript";
import Sequelize from "sequelize";
// import { DataTypes } from 'sequelize/types';
import { v4 as uuid } from "uuid";
import { Token } from "./token.model";

@Table
export class User extends Model {
  @Column({
    type: Sequelize.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  })
  guid: typeof uuid;

  @Column({
    type: Sequelize.STRING,
  })
  displayName: string;

  @Column({
    type: Sequelize.STRING,
  })
  emailAddress: string;

  @Column({
    type: Sequelize.STRING,
  })
  battleTag: string;

  @HasMany(() => Token)
  tokens: Token[];
}
