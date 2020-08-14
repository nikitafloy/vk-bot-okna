import api from 'node-vk-bot-api/lib/api';
import keys from './keys/index';
import {Iparams} from './Interfaces/bot/Iparams';

const getAdmins = (): Promise<String | Boolean> => {
  const params: Iparams = {
    group_id: keys.GROUP_ID,
    access_token: keys.TOKEN,
    fields: 'contacts',
  };

  return api('groups.getById', params)
    .catch(e => console.error(e))
    .then(res => {
      if (res.response && typeof res.response === 'object') {
        let admins: Array<number> = [];
        res.response[0].contacts.forEach(item => admins.push(item.user_id));
        return admins.join(',');
      } else {
        return false;
      };
    });
};

module.exports = getAdmins;