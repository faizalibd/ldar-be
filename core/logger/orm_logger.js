exports.log = (msg) => {
    switch (msg[1]['type']) {
        case "SELECT":
            console.log("QUERY == ", msg[0]);
            console.log(msg[1]['model'] ? "\nMODEL == " + (msg[1]['model'].name ? msg[1]['model'].name : msg[1]['model']) + "\n" : "");
            break;
        case "BULKDELETE":
            console.log("QUERY == ", msg[0]);
            console.log(msg[1]['model'] ? "\nMODEL == " + (msg[1]['model'].name ? msg[1]['model'].name : msg[1]['model']) + "\n" : "");
            break;
        case "RAW":
            console.log("QUERY == ", msg[0]);
            break;
        default:
            console.log("QUERY == ", msg[0] + "\n");
            console.log("MODEL == ", msg[1]['model'].name + " (" + msg[1]['fields'].join(", ") + ")\n");
            break;
    }
};