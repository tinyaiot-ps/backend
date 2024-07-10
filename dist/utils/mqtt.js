"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttTrashParser = void 0;
const voltageSamples = [2500, 3000, 3500, 4000]; // Example samples, adjust according to your needs
const mqttTrashParser = (message) => {
    var _a, _b;
    // Start with unknown measurements
    let result = {
        timestamp: undefined,
        batteryLevel: undefined,
        fillLevel: undefined,
        signalLevel: undefined,
    };
    // Check types and find properties
    if (typeof message !== 'object' ||
        message === null ||
        !('received_at' in message) ||
        typeof message.received_at !== 'string' ||
        !('uplink_message' in message) ||
        typeof message.uplink_message !== 'object')
        return result;
    // Extract timestamp
    result.timestamp = new Date(message.received_at);
    const uplinkMessage = message.uplink_message;
    // Check types and find properties
    if (!uplinkMessage ||
        !('frm_payload' in uplinkMessage) ||
        typeof uplinkMessage.frm_payload !== 'string' ||
        !('rx_metadata' in uplinkMessage) ||
        !Array.isArray(uplinkMessage.rx_metadata) ||
        uplinkMessage.rx_metadata.length < 1)
        return result;
    // Define a function that retrieves the RSSI property
    function getRSSI(metadata) {
        // Check types and find properties
        if (typeof metadata !== 'object' ||
            !('rssi' in metadata) ||
            typeof metadata.rssi !== 'number')
            return -Infinity;
        return metadata.rssi;
    }
    // Extract measurements
    const payload = Buffer.from(uplinkMessage.frm_payload, 'base64');
    const voltage = payload.readUInt16LE(0);
    const distance = payload.readUInt16LE(2);
    const rssi = uplinkMessage.rx_metadata
        .map(getRSSI)
        .reduce((max, curr) => Math.max(max, curr), -Infinity);
    // Define a function that determines where a given value is located on a piecewise linear function defined by evenly spaced samples
    function getPiecewiseFraction(value, samples) {
        // Check types
        if (typeof value !== 'number' ||
            !Array.isArray(samples) ||
            samples.some((sample) => typeof sample !== 'number'))
            return undefined;
        // Verify that samples are strictly increasing
        for (let index = 1; index < samples.length; index++)
            if (samples[index - 1] >= samples[index])
                return undefined;
        // Find correct index for given value using binary search
        let index = 0;
        let length = samples.length;
        while (length > 0) {
            const half = Math.floor(length / 2);
            if (value >= samples[index + half])
                index += half + 1;
            length = half;
        }
        // Return zero if value is less than smallest sample
        if (index <= 0)
            return 0;
        // Return one if value is greater than largest sample
        if (index >= samples.length)
            return 1;
        // Determine fraction of current interval that is less than value
        const lowerBound = samples[index - 1];
        const upperBound = samples[index];
        const fraction = (value - lowerBound) / (upperBound - lowerBound);
        // Return fraction of all intervals that are less than value
        return (index - 1 + fraction) / (samples.length - 1);
    }
    // Convert extracted measurements
    result.batteryLevel = getPiecewiseFraction(voltage, voltageSamples);
    // TODO: Adjust the minimum and maximum to match real trash bin depth
    result.fillLevel = 1 - ((_a = getPiecewiseFraction(distance, [50, 500])) !== null && _a !== void 0 ? _a : 0);
    result.signalLevel = (_b = getPiecewiseFraction(rssi, [-120, -100])) !== null && _b !== void 0 ? _b : 0;
    return result;
};
exports.mqttTrashParser = mqttTrashParser;
