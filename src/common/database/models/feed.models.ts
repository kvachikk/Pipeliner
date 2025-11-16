import { Table, Column, Model, PrimaryKey, Default, DataType, HasMany } from 'sequelize-typescript';

import { Article } from './article.models';

@Table({ tableName: 'feeds', timestamps: true })
export class Feed extends Model {
   @PrimaryKey
   @Default(DataType.UUIDV4)
   @Column(DataType.UUID)
   declare id: string;

   @Column({ type: DataType.STRING, unique: true, allowNull: false })
   declare url: string;

   @Column
   declare title: string;

   @Column({ type: DataType.DATE, allowNull: true })
   declare lastFetchedAt?: Date;

   @HasMany(() => Article)
   declare articles: Article[];
}
