/**
 * Created by J.Son on 2020/4/8
 */
const axios = require('axios');
const dbParkInfo = require('../db/parkInfo');
const schedule = require('node-schedule');
const parkIds = [
  '1643804347442401302',
  '1643818186224439297',
  '1643823961891143686',
  '1652797440364646408',
  '1643824362602364935',
  '1645976963292860421'
];

function getParkInfo () {
  parkIds.forEach(id => {
    axios.get(`https://wechat.gz.aipark.com/wechat/2.0/park/getParkById/${id}`).then(res => {
        const {value: {park: {parkId, parkName, scopeId}}} = res.data;
        console.log(parkId, parkName, scopeId);
        dbParkInfo.insertParkInfo({
          parkId, parkName, scopeId
        });
      }
    );
  });
}

function insertParkBerthsAvailable () {
  parkIds.forEach(id => {
    axios.get(`https://wechat.gz.aipark.com/wechat/2.0/park/getParkById/${id}`).then(res => {
        const {value: {park: {parkId, berthsAvailable, totalBerthsNum, disabledOnlyBerthNum}}} = res.data;
        dbParkInfo.insertParkBerthsAvailable({
          parkId, berthsAvailable, totalBerthsNum, disabledOnlyBerthNum
        });
      }
    );
  });
}



// schedule.scheduleJob('30 1 8-20/1 * * *', function () {
// });

schedule.scheduleJob('5 * * * * *', function () {
  console.log('更新停车位...');
  insertParkBerthsAvailable()
});
schedule.scheduleJob('0 0 8 * * *', function () {
  console.log('更新停车场...');
  getParkInfo()
});
console.log('start...');
