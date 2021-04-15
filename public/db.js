const { app } = require('electron');
const isDev = require('electron-is-dev');
const Datastore = require('nedb-promises');

const dbFactory = (fileName) => Datastore.create({
    filename: `${isDev ? '.' :
app.getAppPath('userData')}/data/${fileName}`,
    timestampData: true,
    autoload: true,
});

const db = {
    tags: dbFactory('tags.db'),
    posts: dbFactory('posts.db'),
};

module.exports = db;