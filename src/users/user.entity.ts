import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  //-----THESE HOOKS ARE ONLY EXECUTED WHEN AN ENTITY IS CREATED AND THEN SAVED-----------//
  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with id ${this.id}`);
  }
}
