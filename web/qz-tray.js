var QZTray = /** @class */ (function () {
    function QZTray() {
        this._qz = window['qz'];
    }
    QZTray.prototype.setCertificate = function (certificate) {
        this._qz.security.setCertificatePromise(function (resolve) {
            return resolve(certificate);
        });
    };
    QZTray.prototype.setSignature = function (sign) {
        this._qz.security.setSignaturePromise(function (_) {
            return function (resolve, reject) {
                return resolve(sign(_));
            };
        });
    };
    QZTray.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._qz.websocket.isActive()) {
                resolve();
            }
            _this._qz.websocket
                .connect()
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(new Operation(null, err));
            });
        });
    };
    QZTray.prototype.getPrinters = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connect()
                .then(function () {
                _this._qz.printers
                    .find()
                    .then(function (printers) {
                    resolve(new Operation(printers, null));
                })
                    .catch(function (err) {
                    reject(new Operation(null, err));
                });
            })
                .catch(function (errConn) {
                reject(new Operation(null, errConn.error));
            });
        });
    };
    QZTray.prototype.print = function (payload) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var qzTrayConfig;
            try {
                qzTrayConfig = _this._qz.configs.create(payload.printer, payload.config);
            }
            catch (err) {
                reject(reject(new Operation(null, err)));
            }
            _this.connect()
                .then(function () {
                _this._qz.print(qzTrayConfig, payload.data)
                    .then(function () {
                    resolve();
                })
                    .catch(function (err) {
                    reject(new Operation(null, err));
                });
            })
                .catch(function (errConn) {
                reject(new Operation(null, errConn.error));
            });
        });
    };
    return QZTray;
}());
var Operation = /** @class */ (function () {
    function Operation(data, error) {
        this._data = data;
        this._error = error;
    }
    Object.defineProperty(Operation.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Operation.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: false,
        configurable: true
    });
    return Operation;
}());
