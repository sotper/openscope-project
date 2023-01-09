import CNetworkConnection, { INetworkConnectOption } from "./network";
/**
 * @class VatsimConnection
 * @description Class to handle packets between client and vatsim
 * server
 */
export class VatsimConnection extends CNetworkConnection {
    constructor(options?: INetworkConnectOption) {
        super();
        if (options) this._configure(options);
    }
    override _start(): void {
        if (!this.connected) return;
        this.client.on('data', (data) => {
            const dataline = data.toString();
            switch (dataline[0]) {
                case '$':
                    this.emitter.emit('reqandres')(null, this.parsePacket(dataline));
                    break;
                case '#':
                    this.emitter.emit('tmandca')(null, this.parsePacket(dataline));
                    break;
                case '%':
                    this.emitter.emit('atcupdate')(null, this.parsePacket(dataline));
                    break;
                case '@':
                    this.emitter.emit('aircraftupdate')(null, this.parsePacket(dataline));
                    break;
                default:
                    this.emitter.emit('error')(new Error('cannot read the prefix of dataline.'));
                    break;
            }
        });
    }
}
export default VatsimConnection;