import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:qz_tray/exception/connection_exception.dart';
import 'package:qz_tray/exception/find_printers_exception.dart';
import 'package:qz_tray/exception/print_exception.dart';
import 'package:qz_tray/qz_tray/qz_tray.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QZTray Demo',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: const MyHomePage(title: 'QZTray Flutter Plugin Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final _qzTray = QZTray();

  void _setCertificateAndSignature() {
    _qzTray.setCertificate();
    _qzTray.setSignature();
  }

  void _connect() async {
    try {
      await _qzTray.connect();
      log('========= Connected to QZ Tray ===========');
    } on ConnectionException catch (exception) {
      log(exception.cause);
    }
  }

  void _findPrinters() async {
    try {
      final operation = await _qzTray.getPrinters();
      log('========= Printer(s) found ===========');
      log(operation.data);
    } on FindPrintersException catch (exception) {
      log(exception.cause);
    }
  }

  void _printZpl() async {
    try {
      final printPayload = PrintPayload(
        printer: 'ZDesigner',
        config: {
          'size': { 'width': 3, 'height': 1 }, 'units': 'in',
          'colorType': 'blackwhite',
          'copies': 1,
          'margins': 100
        },
        data: [
          '^XA\n',
          '^FO50,50^ADN,36,20^FDPRINTED USING QZ TRAY PLUGIN\n',
          '^FS\n',
          '^XZ\n'
        ]
      );

      await _qzTray.print(printPayload);
      log('========= Print success! ===========');
    } on PrintException catch (exception) {
      log(exception.cause);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
       child: Column(
         mainAxisAlignment: MainAxisAlignment.center,
         children: [
           //ElevatedButton(onPressed: _setCertificateAndSignature, child: const Text('Certificate & Signature')),
           SizedBox(height: 16,),
           ElevatedButton(onPressed: _connect, child: const Text('Connect')),
           SizedBox(height: 16,),
           ElevatedButton(onPressed: _findPrinters, child: Text('Find Printers')),
           SizedBox(height: 16,),
           ElevatedButton(onPressed: _printZpl, child: Text('Print ZPL'))
         ],
       ),
      )
    );
  }
}
