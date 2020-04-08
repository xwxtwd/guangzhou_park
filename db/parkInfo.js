/**
 * Created by J.Son on 2020/4/8
 */

const sqlite = require('sqlite');
const path = require('path');
let db = null;

async function getDataBase () {
  if (db) return db;
  db = await sqlite.open(path.resolve(__dirname, './sqlite.db'), {cached: true, verbose: true});
  return db;
}

async function insertParkBerthsAvailable ({parkId, berthsAvailable, totalBerthsNum, disabledOnlyBerthNum}) {
  const db = await getDataBase();
  const tableName = 'parkBerthsAvailable';
  await db.run('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' +
    'parkId TEXT NOT NULL,' +
    'berthsAvailable NUMBER ,' +
    'totalBerthsNum NUMBER ,' +
    'disabledOnlyBerthNum NUMBER ,' +
    'createTime TEXT' +
    ') ');
  const insert = await db.prepare('INSERT INTO ' +
    tableName + ' (parkId,berthsAvailable,totalBerthsNum,disabledOnlyBerthNum,createTime) VALUES (?,?,?,?,?)');
  const time = Date.now().toString();
  await insert.run(parkId, berthsAvailable, totalBerthsNum, disabledOnlyBerthNum, time);
  await insert.finalize();
}

async function insertParkInfo ({parkId, parkName, scopeId}) {
  const db = await getDataBase();
  const tableName = 'parkInfo';
  await db.run('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' +
    'parkId TEXT PRIMARY KEY NOT NULL,' +
    'parkName TEXT ,' +
    'scopeId TEXT' +
    ') ');
  const insert = await db.prepare('REPLACE INTO ' +
    tableName + ' (parkId, parkName, scopeId) VALUES (?,?,?)');
  await insert.run(parkId, parkName, scopeId);
  await insert.finalize();
}

exports = module.exports = {
  insertParkInfo,
  insertParkBerthsAvailable
};
