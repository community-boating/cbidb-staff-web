const ini = require('ini');
const fs = require('fs');

const config = ini.parse(fs.readFileSync(`./ini/config.ini`, 'utf-8'));

const serverConfig = (function() {
	const prodConfig = {
		// TODO: dev vs prod config
	
		SELF: {
			host: config.hostName,
			https: true,
			pathPrefix: "/api",
			port: 443
		}
	}
	
	const devConfig = {
		...prodConfig,
		SELF: {
			...prodConfig.SELF,
			host: config.hostNameDev,
			https: false,
			port: config.port || 8081
		}
	}
	
	return (process.env.NODE_ENV == 'development' ? devConfig : prodConfig);
}());

module.exports = {
	config,
	serverConfig,
	selfServerParams: {
		...serverConfig.SELF,
		//makeRequest: (serverConfig.SELF.https ? https.request : http.request),
		//port: (serverConfig.SELF.https ? 443 : 80)
	},
	apiServerParams: {
		...serverConfig.API,
	//	makeRequest: (serverConfig.API.https ? https.request : http.request),
	},
	serverToUseForAPI: serverConfig.SELF,
	devAPIServer: config.devAPI
}
