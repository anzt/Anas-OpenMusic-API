const routes = require('./routes');
const ExportsHandler = require('./handler');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { serviceExports, servicePlaylistsongs, validator }) => {
    const exportsHandler = new ExportsHandler(serviceExports, servicePlaylistsongs, validator);
    server.route(routes(exportsHandler));
  },
};
