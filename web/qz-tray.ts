type Nullable<T> = T | null;

interface PrintPayload {
    printer: string,
    config: any,
    data: any
}

class QZTray {
    private _qz: any;

    constructor() {
        this._qz = window['qz'];
    }

    setCertificate(certificate: string): void {
        this._qz.security.setCertificatePromise((resolve) => {
            return resolve(certificate);
        });
    }

    setSignature(sign: (toSign: string) => string): void {
        this._qz.security.setSignaturePromise((_: string) => {
            return (resolve, reject) => {
                return resolve(sign(_));
            }
        });
    }

    connect(): Promise<Operation | void> {
        return new Promise<Operation | void>((resolve, reject) => {
            if (this._qz.websocket.isActive()) {
                resolve();
            }

            this._qz.websocket
            .connect()
            .then(() => {
                resolve();
            })
            .catch((err: any) => {
                reject(new Operation(null, err));
            })
        });
    }
    
    getPrinters(): Promise<Operation> {
        return new Promise<Operation>((resolve, reject) => {
            this.connect()
            .then(() => {
                this._qz.printers
                .find()
                .then((printers: string | string[]) => {
                    resolve(new Operation(printers, null));
                })
                .catch((err: any) => {
                    reject(new Operation(null, err));
                });
            })
            .catch((errConn: Operation) => {
                reject(new Operation(null, errConn.error));
            });

        });
    }

    print(payload: PrintPayload): Promise<Operation | void> {
        return new Promise<Operation | void>((resolve, reject) => {
            let qzTrayConfig: any
            try {
                qzTrayConfig = this._qz.configs.create(payload.printer, payload.config);
            } catch(err: any) {
                reject(reject(new Operation(null, err)));
            }
            
            this.connect()
            .then(() => {
                this._qz.print(qzTrayConfig, payload.data)
                .then(() => {
                    resolve();
                })
                .catch((err: any) => {
                    reject(new Operation(null, err))
                });
            })
            .catch((errConn: Operation) => {
                reject(new Operation(null, errConn.error));
            });
        });
    }
}

class Operation {
    private _data: any;
    private _error: Nullable<string>;

    constructor(data: any, error: Nullable<string>) {
        this._data = data;
        this._error = error;
    }

    get data(): any {
        return this._data;
    }

    get error(): any {
        return this._error;
    }
}