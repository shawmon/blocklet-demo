import { validate } from 'class-validator';
import { dataSource } from '../data-source';
import { Profile } from '../entities/profile';

export class ProfileService {
  async save(payload: Profile) {
    const profile = new Profile();

    let key: keyof typeof payload;
    for (key in payload) {
      if (Object.hasOwn(payload, key)) {
        profile[key] = payload[key];
      }
    }

    const errors = await validate(profile);
    if (errors.length) {
      throw new Error('Validation failed!');
    }

    return dataSource.getRepository(Profile).save(profile);
  }

  findOne(id: Profile['id']) {
    return dataSource.getRepository(Profile).findOneBy({ id });
  }

  async update(id: Profile['id'], payload: Exclude<Profile, 'id'>) {
    const profile = await this.findOne(id);
    if (!profile) {
      throw new Error('No profile found!');
    }

    let key: keyof typeof payload;
    for (key in payload) {
      if (Object.hasOwn(payload, key)) {
        profile[key] = payload[key];
      }
    }

    const errors = await validate(profile);
    if (errors.length) {
      // eslint-disable-next-line no-console
      console.log('constraints', errors[0]?.constraints);
      throw new Error('Validation failed!');
    }

    return dataSource.getRepository(Profile).save(profile);
  }

  delete(id: Profile['id']) {
    return dataSource.getRepository(Profile).delete({ id });
  }
}

export const profileService = new ProfileService();
