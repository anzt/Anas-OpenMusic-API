const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postPlaylistsongHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];
module.exports = routes;
