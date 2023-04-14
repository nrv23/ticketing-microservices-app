import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper { // clase singleton para conexion con  NATS  service

    private _client?: Stan;

    get client(){

        if(!this._client) {
            throw new Error("No se puede acceder al cliente nats sin una conexión");
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {

        this._client = nats.connect(clusterId, clientId, { url });

        
        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });

            this.client.on("error", err => {
                reject(err);
            })
        })
    }
}


export const natsWrapper = new NatsWrapper();