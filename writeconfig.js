const fs = require('fs')

const config = {
    App: {
        api: {
            host: process.env.TASK_LIST_URI,
            port: Number(process.env.TASK_LIST_PORT)
        }
    }
}

try {
    fs.writeFileSync(process.argv[2], JSON.stringify(config))
} catch (err) {
    console.error(err)
    process.exit(1)
}