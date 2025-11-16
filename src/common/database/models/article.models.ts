import { Table, Column, Model, PrimaryKey, Default, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Feed } from './feed.models';

@Table({ tableName: 'articles', timestamps: true })
export class Article extends Model {
   @PrimaryKey
   @Default(DataType.UUIDV4)
   @Column(DataType.UUID)
   declare id: string;

   @ForeignKey(() => Feed)
   @Column({ type: DataType.UUID, allowNull: false })
   declare feedId: string;

   @BelongsTo(() => Feed)
   declare feed: Feed;

   @Column({ type: DataType.STRING, allowNull: true })
   declare externalId?: string;

   @Column({ type: DataType.STRING, allowNull: false })
   declare title: string;

   @Column({ type: DataType.STRING, allowNull: false, unique: true })
   declare link: string;

   @Column({ type: DataType.DATE, allowNull: true })
   declare publishedAt?: Date;

   @Column({ type: DataType.TEXT, allowNull: true })
   declare content?: string;
}
