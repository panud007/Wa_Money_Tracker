module.exports = {
    apps: [{
        name: "money-flow-bot",
        script: "src/bot.js",
        watch: true,
        ignore_watch: ["node_modules", "auth_info_baileys", "logs", "qrcode.png", "*.log"],
        max_memory_restart: '200M',
        env: {
            NODE_ENV: "production",
        }
    }]
}
