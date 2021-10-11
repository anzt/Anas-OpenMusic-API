/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistsongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
  }

  async postPlaylistsongHandler(request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;
      await this._service.verifyPlaylistsongOwner(playlistId, credentialId);

      const playlistsongId = await this._service.addPlaylistsong(playlistId, songId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke dalam playlist',
        data: {
          playlistsongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = PlaylistsongsHandler;
