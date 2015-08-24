Package.describe({
  name: 'napsy:cfs-ipfs',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'CollectionFS - IPFS StorageAdapter',
  // URL to the Git repository containing the source code for this package.
  git: 'git@github.com:mhhf/cfs-ipfs.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'stream-buffers': '2.1.0',
  'ipfs-api': '2.1.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  
  api.use(['cfs:base-package@0.0.30', 'cfs:storage-adapter@0.2.1']);
  
  api.addFiles('ipfs.server.js', ['server']);
  api.addFiles('ipfs.client.js', ['client']);
  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('napsy:cfs-ipfs');
  api.addFiles('cfs-ipfs-tests.js');
});
