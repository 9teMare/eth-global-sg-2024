"use client";

import { BACKEND_URL, WORLD_ACTION_ID, WORLD_APP_ID } from "@/constants";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";

export default function WorldIdModal() {
    const handleVerify = async (proof: ISuccessResult) => {
        console.log("BACKEND_URL", BACKEND_URL);
        const res = await fetch(BACKEND_URL + "/api/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
                // This is the button that will open the IDKit modal
                <button onClick={open}>Verify with World ID</button>
            )}
        </IDKitWidget>
    );
}
