module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 5000000
        },
        testnet: {
            host: "localhost",
            port: 8547,
            network_id: 4,
            gas: 6000000,
            gasPrice: 21000000111
        }
    }
};
