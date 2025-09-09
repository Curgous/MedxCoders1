// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'], // use 'module:metro-react-native-babel-preset' if not using Expo
        plugins: [
            ['module:react-native-dotenv', {
                moduleName: '@env',
                path: '.env',
                safe: false,
                allowUndefined: true,
            }]
        ]
    };
};
