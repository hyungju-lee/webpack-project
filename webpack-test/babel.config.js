module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: '79',
                    ie: '10'
                },
                useBuiltIns: 'usage',
                corejs: {
                    version: 3
                }
            }
        ]
    ]
}