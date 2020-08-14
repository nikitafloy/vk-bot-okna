import * as api from 'node-vk-bot-api/lib/api';
import keys from './keys/index';
import {Iparams} from './Interfaces/bot/Iparams';

const params: Iparams = {
  group_id: keys.GROUP_ID,
  access_token: keys.TOKEN,
  fields: 'contacts',
};

export default async (): Promise<String | Boolean> => {
  try {
    const contacts = await api('groups.getById', params);
    if (contacts.response && typeof contacts.response === 'object') {
      let admins: Array<number> = [];
      contacts.response[0].contacts.forEach(item => admins.push(item.user_id));
      return admins.join(',');
    };
  } catch (e) {
    console.error(e);
  };
  return false;
};