'use strict';

const raw = require('raw-socket');
const net = require('net');
const { Resolver } = require('dns').promises;

const resolver = new Resolver();
const RESPONSE_TYPE = ['REPLY', 'NA', 'NA', 'DESTINATION_UNREACHABLE', 'SOURCE_QUENCH', 'REDIRECT'];
const DEFAULT_TIMEOUT = 3000;

class FastestServer {

	static _ping(host, timeoutDuration = DEFAULT_TIMEOUT) {
		if (typeof host !== 'string') {
			throw new Error('host must be string');
		}
		return new Promise(async (resolve, reject) => {
			const hostIP = net.isIPv4(host) ? host : (await resolver.resolve4(host))[0];
			const socket = raw.createSocket({ protocol: raw.Protocol.ICMP });
			const msg = Buffer.alloc(8, 0);
			let start;
			let timer;

			msg.writeUInt8(8, 0);
			raw.writeChecksum(msg, 2, raw.createChecksum(msg));
			socket.send(msg, 0, msg.length, hostIP, (err) => {
				if (err) {
					reject({ host, response: err.message});
				}
				start = Date.now();
				timer = setTimeout(() => {
					socket.close();
					resolve({ host,  response: 'TIMEOUT' });
				}, timeoutDuration)
			});
			socket.on('message', (buffer) => {
				const type = buffer.readUInt8(20);
				const response = RESPONSE_TYPE[type] || 'Unknown';
				
				if (!type) {
					resolve({ host, response, timeElapsed: Date.now() - start });
				} else {
					resolve({ host, response });
				}

				socket.close();
				clearTimeout(timer);
			});
			socket.on('error', err => {
				reject({ host, response: err.message});
			});
		});
	}

	static async get(hosts = [], timeout = DEFAULT_TIMEOUT) {
		if (!Array.isArray(hosts)) {
			throw new Error('hosts must be an array');
		}
		const promises = hosts.map((host) => FastestServer._ping(host, timeout));
		const results = (await Promise.allSettled(promises) || []).reduce((acc, result) => {
			if (result.status === 'fulfilled' && result.value.timeElapsed) {
				if (!acc.fastest || acc.fastest.timeElapsed > result.value.timeElapsed) {
					acc.fastest = result.value;
				}
			}
			acc.stats.push(result.value || result.reason);
			return acc;
		}, { stats: [], fastest: undefined });

		return { fastest: results.fastest && results.fastest.host, stats: results.stats };
	}
}

module.exports = FastestServer;
