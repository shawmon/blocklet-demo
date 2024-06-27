import axios from '../../libs/api';
import { Profile } from './types';

export async function getProfile() {
  const response = await axios.get('/api/profile');
  return response.data as Profile;
}

export async function setProfile(data: Partial<Profile>) {
  const response = await axios.put('/api/profile', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data as Profile;
}
