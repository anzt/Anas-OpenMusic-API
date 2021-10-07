// eslint-disable-next-line camelcase
const mapPlaylists = ({ owner, ...args }) => ({
  ...args,
  username: owner,
});
module.exports = { mapPlaylists };
