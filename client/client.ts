import { delay } from "@whitigol/fivem-utils";
import config from "../util/config";
import NuiMessage from "../util/nuiMessage";
/* FiveM Typescript Boilerplate by Whitigol */

//? Start your client script below here.
/* CLIENT SCRPIT */
let isNuiOpen = false;

NuiMessage({
    type: "init",
    name: config.cadName,
    url: config.cadUrl,
});

RegisterCommand(
    config.command,
    () => {
        isNuiOpen = !isNuiOpen;
        NuiMessage({
            type: isNuiOpen ? "close" : "open",
        });
        SetNuiFocus(isNuiOpen, isNuiOpen);
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
            await delay(0);
            const ped = PlayerPedId();
            const isInVehicle = IsPedInAnyVehicle(ped, false);
            if (isInVehicle) {
                if (
                    config.vehicle.exemptPassenger &&
                    GetPedInVehicleSeat(GetVehiclePedIsIn(ped, false), -1) ===
                        ped
                ) {
                    continue;
                }

                const vehicle = GetVehiclePedIsIn(ped, false);
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
