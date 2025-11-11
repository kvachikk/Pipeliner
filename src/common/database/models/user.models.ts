import { Table, Column, Model, PrimaryKey, Default, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
   @PrimaryKey
   @Default(DataType.UUIDV4)
   @Column(DataType.UUID)
   declare id: string;

   @Column({ type: DataType.STRING, unique: true, allowNull: false })
   declare email: string;

   @Column({ type: DataType.STRING, allowNull: false })
   declare passwordHash: string;
}
