FS.Store.IPFS = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.IPFS))
    throw new Error('FS.Store.IPFS missing keyword "new"');

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.ipfs'
  });
};

FS.Store.IPFS.prototype.fileKey = function(fileObj) {
  return fileObj.collectionName + '/' + fileObj._id + '-' + fileObj.name();
};
