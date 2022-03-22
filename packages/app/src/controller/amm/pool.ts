import { Next } from "koa";
import { Context } from "vm";
import { Resp } from "@parallel/lib";


export async function getPoolList(ctx: Context, next: Next) {
    ctx.body = Resp.Ok()
    return next()
}