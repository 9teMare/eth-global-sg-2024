"use client";

import { BACKEND_URL, WORLD_ACTION_ID, WORLD_APP_ID } from "@/constants";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import ky from "ky";
import { GlobeIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function WorldIdModal() {
    const handleVerify = async (proof: ISuccessResult) => {
        console.log("BACKEND_URL", BACKEND_URL);
        const res = await ky.post(BACKEND_URL + "/api/verify", {
            body: JSON.stringify(proof),
        });

        console.log("Verification response:", res);
        if (!res.ok) {
            throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
        }
    };

    const onSuccess = (proof: ISuccessResult) => {
        // This is where you should perform frontend actions if the verification succeeds
        // Such as, updating the UI to show that the user is verified
        console.log("Verification successful!", proof);
    };

    return (
        <IDKitWidget
            app_id={WORLD_APP_ID}
            action={WORLD_ACTION_ID}
            onSuccess={onSuccess}
            handleVerify={handleVerify}
            verification_level={VerificationLevel.Device}
        >
            {({ open }) => (
                <Button variant="ghost" size="icon" onClick={open}>
                    <GlobeIcon className="h-4 w-4" />
                    <span className="sr-only">Verify with World ID</span>
                </Button>
            )}
        </IDKitWidget>
    );
}
