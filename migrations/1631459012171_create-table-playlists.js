/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            unique: true,
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint('playlists', 'fk_users.owner.id', 
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('playlists');
};
