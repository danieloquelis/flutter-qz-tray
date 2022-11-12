
async function jsPromiseFunction(message) {
        
    let msg = message;
    let promise = new Promise(function(resolve, reject) {
        resolve('Hello : ' + message);
    });
    console.log('Message ====>', message)
    let result = await promise;

    //qz
    const qz = window.qz;
    console.log('qz', qz)


//    qz.websocket.connect().then(() => {
//        qz.printers.find().then(function(data) {
//            var list = '';
//            for(var i = 0; i < data.length; i++) {
//               list += "&nbsp; " + data[i] + "<br/>";
//           }
//           console.log('found', list)
//        }).catch(function(e) { console.error(e); });
//    }).catch(err => {
//        alert('Error conection')
//        console.log(err)
//    })

    
    
    var config = qz.configs.create("ZDesigner", {
        size: { width: 3, height: 1 }, units: 'in',
        colorType: 'blackwhite',
        copies: 1,
        margins: 100
      });

    const res = [
        '^XA\n',
        '^FO50,50^ADN,36,20^FDPRINTED USING QZ TRAY PLUGIN\n',
        '^FS\n',
        '^XZ\n'
     ];
    qz.websocket.connect().then(() => {
        qz.print(config, res).catch((err) => {
            console.log('IMPRIMIENDO ERROR', err)
            alert('ERROR IMPRIMIENDO')
        });
    }).catch(err => {
        alert('Error conection')
        console.log(err)
    })
    console.log('pasoo')
    return result;
}

async function jsOpenTabFunction(url) {
    let promise = new Promise(function(resolve, reject) {
        var win = window.open(url,"New Popup Window","width=800,height=800");
        console.log("window",win);

        var timer = setInterval(function() {
                if (win.closed) {
                    clearInterval(timer);
                    alert("'Popup Window' closed!");
                    resolve('Paid');
                }
            }, 500);
        console.log("window",win);
    });
    let result = await promise;
    console.log("result",result);
    return result;
}