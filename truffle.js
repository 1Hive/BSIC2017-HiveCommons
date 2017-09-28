module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        testnet: {
            host: "localhost",
            port: 8547,
            network_id: 4,
            gas: 4000000,
            gasPrice: 21000000111
        }
    }
};
