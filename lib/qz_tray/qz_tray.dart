@JS()
library qz_tray;

import 'dart:developer';

import 'package:js/js.dart';
import 'package:js/js_util.dart';
import 'package:qz_tray/exception/connection_exception.dart';
import 'package:qz_tray/exception/find_printers_exception.dart';
import 'package:qz_tray/exception/print_exception.dart';

class QZTray {
  final interface = _QZTray();

  void setCertificate() {
    interface.setCertificate('Certificate11');
  }

  void setSignature() {
    interface.setSignature(allowInterop((toSign) {
      log('=====To sign====');
      log(toSign);
      return 'signature perro';
    }));
  }

  Future<void> connect() async {
    try {
      await promiseToFuture(interface.connect());
    } on Operation catch(operation) {
      throw ConnectionException(operation.error ?? 'Error trying to connect to qz tray driver.');
    }
  }

  Future<Operation> getPrinters() async {
    try {
      return await promiseToFuture<Operation>(interface.getPrinters());
    } on Operation catch(operation) {
      throw FindPrintersException(operation.error ?? 'Error trying to find printers.');
    }
  }

  Future<void> print(PrintPayload payload) async {
    try {
      await promiseToFuture<Operation>(interface.print(payload));
    } on Operation catch(operation) {
      throw PrintException(operation.error ?? 'Error trying to print.');
    }
  }
}

@JS('QZTray')
class _QZTray {
  external _QZTray();
  external void setCertificate(String certificate);
  external void setSignature(String Function(String toSign) func);
  external dynamic connect();
  external dynamic getPrinters();
  external dynamic print(PrintPayload payload);
}

@JS()
class Operation {
  external dynamic get data;
  external String? get error;
  external factory Operation(int status, dynamic data, String? error);
}

@JS()
@anonymous
class PrintPayload {
  external String get printer;
  external dynamic get config;
  external dynamic get data;
  external factory PrintPayload({String printer, dynamic config, dynamic data});
}