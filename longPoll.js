const keys = require('./keys/index');

require('request-promise').get(`https://api.vk.com/method/groups.getLongPollServer?group_id=${keys.GROUP_ID}&access_token=${keys.TOKEN}&v=5.122`)
  .catch(e => {throw new Error(e)})
  .then(res => {
    const {key, server, ts} = JSON.parse(res).response;
    const query = `${server}?act=a_check&key=${key}&ts=${ts}&wait=25`;
    console.log(`Long Poll Server is Ready: ${query}`);
  });