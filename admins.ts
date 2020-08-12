const api = require('node-vk-bot-api/lib/api');
const keys = require('./keys/index');

module.exports = () => {
    const params: Object = {
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