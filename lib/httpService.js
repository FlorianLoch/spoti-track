const Koa = require("koa");
const koaLogger = require("koa-logger");
const koaRoute = require("koa-router")();
const co = require("co");

const spotifyAdapter = require("./spotifyAdapter");

const app = new Koa();

const server = require("http").createServer(app.callback());

koaRoute.get("/current", function* () {
    this.body = yield spotifyAdapter.getCurrentMetadata();
});

app.use(koaLogger());
app.use(koaRoute.routes());
app.use(koaRoute.allowedMethods());

module.exports = {
    start: (port, interface) => {
        return new Promise((resolve) => {
            server.listen(port, interface, resolve);
        });
    }
};