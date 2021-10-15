/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(serviceExports, servicePlaylistsongs, validator) {
    this._serviceExports = serviceExports;
    this._servicePlaylistsongs = servicePlaylistsongs;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistsPayload(request.payload);
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._servicePlaylistsongs.verifyPlaylistsongOwner(playlistId, credentialId);

      await this._serviceExports.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
        console.error(error);
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

module.exports = ExportsHandler;
