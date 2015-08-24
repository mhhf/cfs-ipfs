## CollectionFS - IPFS Storage Adapter
IPFS is a new hypermedia distribution protocol, addressed by content and identities. IPFS enables the creation of completely distributed applications. It aims to make the web faster, safer, and more open.

**NOTE:** This package is in it's early aplha phase and for testing purposes only!

## Installation
Make sure you have [ipfs installed](http://ipfs.io/docs/install/) and the deamon running:
`ipfs deamon`

Add the following packages:
```
meteor add cfs:standard-packages
meteor add cfs:filesystem
meteor add napsy:cfs-ipfs
```

## Usage
Initialize your Collection and use it as usual.
```
var ipfsStore = new FS.Store.IPFS("ipfsi");

Images = new FS.Collection("images", {
  stores: [ipfsStore]
});
```

## License 

MIT
