import { delay } from "@whitigol/fivem-utils";
import config from "../util/config";
import NuiMessage from "../util/nuiMessage";
/* FiveM Typescript Boilerplate by Whitigol */

//? Start your client script below here.
/* CLIENT SCRPIT */
let isNuiOpen = false;

on("onClientResourceStart", async (resource: string) => {
    if (resource !== GetCurrentResourceName()) return;

    await delay(1000);

    NuiMessage({
        type: "init",
        data: {
            name: config.cadName,
            url: config.cadUrl,
        },
    });
});

RegisterCommand(
    config.command,
    () => {
        isNuiOpen = !isNuiOpen;
        SetNuiFocus(isNuiOpen, isNuiOpen);
        NuiMessage({
            type: isNuiOpen ? "open" : "close",
        });
    },
    false
);

emit("chat:addSuggestion", `/${config.command}`, config.helpText);

RegisterKeyMapping(
    config.command,
    `${config.helpText}`,
    "keyboard",
    config.defaultKeybind
);

if (config.vehicle.checkSpeed) {
    setTick(async () => {
        while (true) {
            await delay(300);
            const ped = PlayerPedId();
            const isInVehicle = IsPedInAnyVehicle(ped, false);
            if (!isNuiOpen) continue;
            if (isInVehicle) {
                // Passengers can be exempt from speed check. If the ped is a passenger, we skip the speed check.
                const vehicle = GetVehiclePedIsIn(ped, false);

                if (config.vehicle.exemptPassengers) {
                    const driver = GetPedInVehicleSeat(vehicle, -1);
                    if (driver !== ped) continue;
                }

                const speed = GetEntitySpeed(vehicle) * 2.23694;
                if (speed > config.vehicle.speed) {
                    NuiMessage({
                        type: "close",
                        message:
                            "You are going too fast to use the CAD. Please slow down.",
                    });
                    SetNuiFocus(false, false);
                    isNuiOpen = false;
                }
            }
        }
    });
}

RegisterNuiCallbackType("close");
on("__cfx_nui:close", () => {
    SetNuiFocus(false, false);
    isNuiOpen = false;
});
