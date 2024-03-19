export interface Config {
    licenseKey:     string;
    cadName:        string;
    cadUrl:         string;
    command:        string;
    helpText:       string;
    defaultKeybind: string;
    "_↑":           string[];
    vehicle:        Vehicle;
}

export interface Vehicle {
    checkSpeed:       boolean;
    speed:            number;
    exemptPassengers: boolean;
    "_↑":             string[];
}
