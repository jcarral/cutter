class CliError extends Error {
    constructor(mssg, props) {
        super(mssg);
        this.name = "CliError";
        Object.assign(this, props);
    }
}

module.exports = CliError;