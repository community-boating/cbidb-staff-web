const ini = require('ini');
const fs = require('fs');

const config = ini.parse(fs.readFileSync(`./ini/config.ini`, 'utf-8'));

const serverConfig = (function() {
	const prodConfig = {
		// TODO: dev vs prod config
	
		SELF: {
			//host: config.hostName,
			//https: false,
			pathPrefix: "/api",
			//port: config.port || 443
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

	const testConfig = {
		...prodConfig,
		SELF: {...prodConfig.SELF,
			host: "localhost",
			port: 6969,
			https: false,
			pathPrefix: ""
		}
	}

	const mapConfigs = {
		'development': devConfig,
		'production': prodConfig,
		'test': testConfig
	}
	
	return (mapConfigs[process.env.NODE_ENV] || devConfig);
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
