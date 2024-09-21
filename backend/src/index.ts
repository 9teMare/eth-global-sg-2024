import { Hono } from "hono";
import { cors } from "hono/cors";
import { ISuccessResult, IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";

const app = new Hono();

app.use("*", cors());

app.post("/api/verify", async (c) => {
    const proof = (await c.req.json()) as ISuccessResult;
    const appId = process.env.APP_ID as `app_${string}`;
    const actionId = process.env.ACTION_ID!;

    const verifyRes = (await verifyCloudProof(proof, appId, actionId)) as IVerifyResponse;

    console.log("Verify Response:", verifyRes);

    if (verifyRes.success) {
        return Response.json({ verifyRes }, { status: 200 });
    } else {
        return Response.json({ error: "Something went wrong" }, { status: 400 });
    }
});

export default {
    port: 8080,
    fetch: app.fetch,
};
