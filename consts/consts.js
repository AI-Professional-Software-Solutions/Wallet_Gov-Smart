module.exports = {

    name: "Gov-Smart Blockchain",
    title: 'Gov-Smart Blockchain',
    entity: 'Gov-Smart',
    website: 'https://gov-smart.com/',

    assetsInfoPagination: 10,
    blocksInfoPagination: 10,
    addressTxsPagination: 10,
    mempoolTxsPagination: 50,

    goArgv: [
        'js',
        '--network=devnet',
        '--new-devnet',
        '--node-consensus=app',
        '--tcp-max-clients=1'
    ],

}
