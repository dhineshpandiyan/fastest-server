# fastest-server

[![Build Status](https://travis-ci.com/dhineshpandiyan/fastest-server.svg?branch=master)](https://travis-ci.com/dhineshpandiyan/fastest-server)
[![Dependency Status](https://david-dm.org/dhineshpandiyan/fastest-server.svg?style=flat-square)](https://david-dm.org/dhineshpandiyan/fastest-server)

Library used to get fastest server using ICMP (Internet Control Message Protocol).

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Methods Exposed](#methods-exposed)

## About

This library is used to get the fastest server from the list of servers (IP’s or host names). Many times same services are running in different regions to serve clients better. And this library will try to ping the list of servers using ICMP (Internet Control Message Protocol). Based on response time it will find the fastest server which is mostly nearest server.

## Installation

```sh
npm install fastest-server
```

## Usage
```javascript
const FastestServer = require('fastest-server');

const { fastest, stats } = await FastestServer.get(['172.217.19.14', 'google.com'])

// fastest - will have fastest host.
// stats - will be more information about response time and respose type.
// {
//   fastest: 'google.com',
//   stats: [
//     { host: '172.217.19.14', response: 'REPLY', timeElapsed: 9 },
//     { host: 'google.com', response: 'REPLY', timeElapsed: 2 }
//   ]
// }
```

## Methods Exposed

### (*static*) FastestServer.get( hosts: *Array< String >*, [timeout: *number*]): *Promise*<{ fastest: *string*, stats: *Array<{* host: *string*, response: *string* , timeElapsed: *numer* }>}>

```javascript
const { fastest, stats } = await FastestServer.get(['172.217.19.14', 'google.com'], 5000);

console.log(fastest); // google.com
console.log(stats);
// [
//   { host: '172.217.19.14', response: 'REPLY', timeElapsed: 9 },
//   { host: 'google.com', response: 'REPLY', timeElapsed: 2 }
// ]
```

> `response` will be one of the value from array: `['REPLY', 'NA',  'DESTINATION_UNREACHABLE', 'SOURCE_QUENCH', 'REDIRECT', 'Unknown']`

> `timeElapsed` will be in milliseconds (`ms`)
