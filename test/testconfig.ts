const serverConfig = require("../config/readIni");

//process.env = serverConfig.serverConfig

//console.log(serverConfig)

//console.log("WOOT")

const a: any = {
    b: "derp"
}

global.console = {
    ...console,
    // uncomment to ignore a specific log level
    //log: () => {},
    debug: () => {},
    info: () => {},
    // warn: jest.fn(),
    // error: jest.fn(),
  };

Object.assign(serverConfig, process.env)

process.env = serverConfig;

Object.keys(serverConfig).forEach((a) => {
    process.env[a] = serverConfig[a] as any
})

module.exports = {

}