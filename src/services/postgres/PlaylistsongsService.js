/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
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
    return result.rows[0].id;
  }

  // async getPlaylistsong()

  async deletePlaylistsong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu pada playlist gagal dihapus');
    }
  }

  async verifyPlaylistsongOwner(playlistid, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlistsong = result.rows[0];

    if (playlistsong.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}
module.exports = PlaylistsongsService;
