import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Length, IsEmail, Matches } from 'class-validator';

@Entity()
export class Profile {
  @PrimaryColumn()
  @Length(10, 10)
  id: string;

  @Column()
  @Length(4, 128)
  name: string;

  @Column()
  @Length(10, 1024)
  description: string;

  @Column()
  @Matches(/^\d{10,24}$/, {
    message: 'Phone number must be between 10 and 24 digit characters',
  })
  phone: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  // NOTE: Since we currently allow data URLs, we are temporarily skipping the validation.
  // @IsUrl()
  picture: string;

  @Column()
  @Length(1, 1024)
  address: string;

  @Column()
  @Length(1, 1024)
  hobby: string;
}
