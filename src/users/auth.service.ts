import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    //hash user password
    //generate the salt
    const salt = randomBytes(8).toString('hex'); //hexadecimal
    //hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; //hexadecimal with 32 chars
    //join the hashed result and salt together with a separetor
    const result = salt + '.' + hash.toString('hex');
    //create new user and save it
    const user = await this.usersService.create(email, result);
    //return the created user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
