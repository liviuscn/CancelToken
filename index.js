var CancelToken = require('./CancelToken.js');
var source = CancelToken.source()

async function waitForIframe(f = () => { }, s = 15000, t = 1000) {
    return await new Promise((resolve, reject) => {
        let timer, beginDate = new Date().getTime();
        let fn = async () => {
            let endDate = new Date().getTime()
            if (timer) clearTimeout(timer)
            if (endDate - beginDate > s) {
                return reject('TimeoutError')
            }
            let frame = await f()
            if (frame) {
                return resolve(frame)
            } else {
                timer = setTimeout(fn, t)
            }
        }
        fn()
    })
}

async function a(params) {
    let p1 = new Promise((resole, reject) => {
        source.token.promise.then(function onCanceled(cancel) {
            reject(cancel);
        })
    }).catch(e => {
        console.log(e, 'p1')
        return e

    })

    let p2 = new Promise((resole, reject) => {
        let res = waitForIframe()
        resole(res)
    }).catch(e => {
        console.log(e, 'p2')
        return e
    }

    )

    let res = await Promise.race([
        p2,
        p1
    ]).catch(e => {
        console.log(e, 'eeee')
        return e
    })
    console.log(res, 'res22222222222222')
    process.exit(0)
}

// a()

// source.cancel('不想执行了')

let timer=setTimeout(() => {
    waitForIframe()

}, 0);

setTimeout(() => {
    clearTimeout(timer)
}, 1);
