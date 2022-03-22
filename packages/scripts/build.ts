import fs from 'fs'
import { exec } from 'child_process'
import { build } from 'esbuild'
import ArgParse from 'minimist'

interface BuildOptions {
    env: 'pro' | 'dev',
    app: string

}

async function runcmd(cmd: string, cwd: string) {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (err, stdout, stderr) => {
            if (err) {
                console.error(stderr)
                reject(err)
                process.exit(1)
            }
            console.log(stdout)
            resolve(stdout)
        })
    })
}

 async function buildApp(options: BuildOptions) {
    const { env, app } = options

    await build({
        entryPoints: [`packages/${app}/src/index.ts`], 
        sourceRoot: `packages/${app}/**/*`,
        outdir: `packages/${app}/dist/src`,

        external: ['koa', 'koa-router', 'pg-native',
            'winston', 'winston-daily-rotate-file',
            '@types/validator', '@types/node'
        ],
        platform: 'node',
        target: 'node14.17.0',
        bundle: true,
        minify: env === 'pro',
        sourcemap: env === 'dev',
    })

    await deployApp(app)
}

async function buildAll() {
    try {
        const args = ArgParse(process.argv.slice(2))
        console.log('arg env: ', args)
        const apps = ['app']
        let papps: Promise<any>[] = []
        for (let app of apps) {
            papps.push(buildApp({ env: args.env || 'pro', app }))
        }
        await Promise.all(papps)
        // buildApi(args.env || 'pro')
    } catch (err) {
        console.error('build error: ', err)
        process.exit(1)
    }
}

function mkdir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

function remfileIfExist(file: string) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file)
    }
}

function copyConfig(app: string) {
    const srcp = `packages/${app}/`
    const destp = `packages/${app}/dist/`
    const fils = fs.readdirSync(srcp)
    mkdir(destp)
    fils.forEach(f => {
        if (f.endsWith('json')) {
            const destf = destp + f
            remfileIfExist(destf)
            fs.copyFileSync(srcp + f, destf)
        }
    })
}

function writeFile(app: string) {
    remfileIfExist(`packages/${app}/dist/package.json`)
    fs.writeFileSync(`packages/${app}/dist/package.json`, '{}')
}

async function deployApp(app: string) {
    fs.copyFileSync(`packages/${app}/.env`, `packages/${app}/dist/.env`)
    writeFile(app)
    await runcmd('yarn add koa koa-router winston winston-daily-rotate-file', `packages/${app}/dist`)
}


buildAll()