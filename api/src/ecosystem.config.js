'use strict';

const apps = [
  {
    name: 'api.test',
    script: './src/api.worker.js',
    instances: 2,
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    wait_ready: true,
    listen_timeout: 6000,
    kill_timeout: 4800,
    autorestart: true,
    watch: true,
    ignore_watch: [
      'node_modules',
      'logs',
      'test',
      'README.md',
      'jest.config.js',
      'jest-e2e.config.js',
      'nodemon.json',
      '.prettierrc',
    ],
  },
];

module.exports = { apps };
