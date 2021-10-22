/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addPlaylistsong(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan pada playlist');
    }
    await this._cacheService.delete(`playlist:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsongs(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT ps.id, s.title, s.performer FROM playlistsongs ps LEFT JOIN songs s ON ps.song_id = s.id WHERE ps.playlist_id = $1 ',
        values: [playlistId],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError('Playlist gagal diverifikasi');
      }
      const resultRows = result.rows;
      await this._cacheService.set(`playlist:${playlistId}`, JSON.stringify(resultRows));
      return resultRows;
    }
  }

  async deletePlaylistsong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu pada playlist gagal dihapus');
    }
    await this._cacheService.delete(`playlist:${playlistId}`);
  }

  async verifyPlaylistsongOwner(playlistId, credentialId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlistsong = result.rows[0];
    if (playlistsong.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}
module.exports = PlaylistsongsService;
