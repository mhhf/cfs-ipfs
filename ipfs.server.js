var Writable = Npm.require('stream').Writable;
var streamBuffers = Npm.require("stream-buffers");
var ipfsAPI = Npm.require('ipfs-api')


FS.Store.IPFS = function( name, options ) {
  
  var self = this;
  if (!(self instanceof FS.Store.IPFS))
    throw new Error('FS.Store.IPFS missing keyword "new"');
  

  // connect to ipfs daemon API server
  var ipfs = ipfsAPI( options.host, options.port );
    
  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.ipfs',
    
    fileKey: function( fileObj, param ) {
      var key = "";
      
      // Lookup the copy
      var info = fileObj && fileObj._getInfo(name);
      
      // If the store and key is found return the key
      if (info && info.key) {
        key = info.key;
      }
      return key;
    },
    
    createReadStream: function(fileKey, options) { 
      
      var wrappedIPFSCat =  Meteor.wrapAsync(ipfs.cat);
      var readableStreamBuffer = new streamBuffers.ReadableStreamBuffer();
      var currentChunk = Buffer(0);
      
      
      var res = wrappedIPFSCat([fileKey]);
      
      res.on('data', function (chunk) {
        currentChunk = Buffer.concat([currentChunk, chunk]);
      });
      
      res.on('end', function() {
         
        // Get the chunk data
        var uploadingChunk = Buffer(currentChunk.length);
        currentChunk.copy(uploadingChunk);
        
        readableStreamBuffer.put(uploadingChunk);
      });
      
      return readableStreamBuffer;
      
    },
    createWriteStream: function(fileKey, options) { 
      
      var currentChunk = Buffer(0);
      var maxChunkSize = 5242880;
      
      var writeStream = Writable({
        highWaterMark: 4194304 // 4 MB
      });
      
      writeStream._write = function (chunk, enc, next, last) {
        currentChunk = Buffer.concat([currentChunk, chunk]);
        next();
      };
      
      var _originalEnd = writeStream.end;
      writeStream.end = function (chunk, encoding, callback) {
        
        // Get the chunk data
        var uploadingChunk = Buffer(currentChunk.length);
        currentChunk.copy(uploadingChunk);
        
        ipfs.add( uploadingChunk, function(err, res) {
          if(err || !res) return console.error(err)
            
            writeStream.emit('stored', {
              fileKey: res[0].Hash,
              storedAt: new Date()
            });
        });
        
        _originalEnd.call( this, chunk, encoding );
      };
      
      
      return writeStream;
    },
    remove: function(fileKey, callback) { 
      console.log('removing ipfs files not implemented');
      callback();
    },
    stats: function(fileKey, callback) {
      callback();
    }
    
  });
  
}
