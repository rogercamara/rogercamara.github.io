
$( document ).ready(function() {
    var orbitaURL = "data.json";
    var db =  openDatabase('dados', '1.0', 'orbita analytics', 2 * 1024 * 1024);
    var dataPeriodo = "18/08/2020 - 15/08/2020"
  

    $('#voltar').click(function(e) {
        document.location.reload(true);
    });

    
    // Engine
    db.transaction(function (tx) {   
        // Cria a tabela
        tx.executeSql('CREATE TABLE IF NOT EXISTS DATA (id INTEGER PRIMARY KEY, coop INTEGER, sessoes INTEGER, username TEXT, email TEXT, posto TEXT)'); 
        // Recebe os dados da API do Analytics
        $.getJSON( "data.json", function( data ) { 
            // Insere os dados no banco local do cliente
            db.transaction(function (transaction) {
                // Limpa o cache dos dados antes de inserir
                transaction.executeSql("DELETE FROM data");
                var len = data.length;
                for(var i = 0; i < len; i++) {
                    // Propriedades
                    var coop        =   data[i].coop;
                    var sessoes     =   data[i].sessoes;      
                    var email       =   data[i].email;   
                    var username    =   data[i].username;
                    var posto       =   data[i].posto;
                    // Executa a inserção
                    transaction.executeSql('INSERT OR IGNORE INTO DATA (coop, sessoes, username, email, posto) VALUES (?,?,?,?,?)',[coop, sessoes, username, email, posto]);
                }
            });
            // Lista cooperativas no select inicial
            db.transaction(function (transaction) {   
                transaction.executeSql("SELECT coop FROM data GROUP BY coop" , [], function (tx, results) {
                    var len = results.rows.length; 
                    var i=0;
                    for (; i < len; i = i + 1) {
                        $('#selectCoop').append('<option value="'+results.rows.item(i).coop+'">'+results.rows.item(i).coop+'</option>');
                    }
                 }, null);
             });
        });
    });

    function selecionaCoop(valor){
        db.transaction(function (transaction) {   
            transaction.executeSql("SELECT * FROM DATA WHERE coop = '"+valor+"'" , [], function (tx, results) {
                var len = results.rows.length; 
                var i=0;
                usuarios = [];
                for (; i < len; i = i + 1) {
                    usuarios[i] = results.rows.item(i);
                }
                $('#coopId').html(valor);
                $('#periodo').html(dataPeriodo);
                $('#table').bootstrapTable({
                    exportTypes: ['excel', 'pdf', 'txt'],
                    export: 'glyphicon-export icon-share',
                    data: usuarios
                });
               
                
             }, null);
             

         });
         $('.unicred-select-coop').fadeOut('200');
         $('.unicred-show-report').fadeIn('200');
    }
    $('#geraRelatorio').click(function(e) {
        var selecionado = [];
        $.each($("#selectCoop option:selected"), function(){       
            if($(this).val() == 'Selecione'){ // or this.value == 'volvo'
                alert('Voce deve selecionar uma cooperativa')
            }  else {
                selecionado.push($(this).val());
                selecionaCoop(selecionado);
            } 
        });
      });
});






// var usuarios = [];

// function queryCoop(){

//     db.transaction(function (transaction) {   
//         transaction.executeSql('SELECT * FROM DATA', [], function (tx, results) {
            
//             var len = results.rows.length; 
//             var i=0;

//             for (; i < len; i = i + 1) {
//                 console.log('dae')
//             }

//          }, null);
//      });
// }

// queryCoop();



    // db.transaction(
    //     function(tx) {

    //         var sql = "SELECT * FROM DATA WHERE coop = '"+valor+"'";

    //         console.log('Selecionando dados do banco');

    //         tx.executeSql(sql, 
    //             function(tx, results) {
    //                 var len = results.rows.length,
    //                     usuarios = [],
    //                     i = 0;
    //                 for (; i < len; i = i + 1) {
    //                     usuarios[i] = results.rows.item(i);
    //                 }
    //                 console.log(usuarios);
    //             }
    //         );

    //     }
    // );

// }



// Carrega dados



// var db = openDatabase('dados', '1.0', 'orbita analytics', 2 * 1024 * 1024);

// db.transaction(function (tx) {   
//     tx.executeSql('CREATE TABLE IF NOT EXISTS DATA (coop INTEGER, sessoes INTEGER, username TEXT, email TEXT, posto TEXT)'); 
//  });
 


// loadJson();

// function queryDBWithParam(param1) {
//   return function(tx) {
//       //you can use parameter param1
//       tx.executeSql('SELECT * FROM my_table', [], querySuccess, errorCB);
//   }
// }

    

// db.transaction(function (tx) {   

//     function queryDBWithParam(param1) {
//         return function(tx) {
//             tx.executeSql('SELECT * FROM my_table', [], querySuccess, errorCB);
//         }
//       }


// });


   
 





   


// $( document ).ready(function(){




//     // function createDB(){
//     //     var db = openDatabase('dados', '1.0', 'Analytics orbita', 2 * 1024 * 1024);

//     //     var jsonData;
        
//     //     db.transaction(function (tx) {
//     //         tx.executeSql('CREATE TABLE dados (username TEXT, email TEXT, coop INTEGER, posto TEXT, sessoes INTEGER)', [], getJson);
//     //     });

        
//     //     function getJson(){

//     //         $.getJSON("data.json", function(data){

//     //             jsonData = data;

//     //             console.log(data)

//     //             // db.transaction(function (tx) {
//     //             //     doInsert(function(){
//     //             //         console.log("DB inserts complete");
//     //             //     }, tx);
//     //             // });

//     //         });

//     //     }
        
//     //     // function doInsert(onSuccess, tx){
//     //     //     if(jsonData.length > 0){
//     //     //         var data = jsonData.shift();
//     //     //         console.log(data);
//     //     //         tx.executeSql('INSERT INTO dados (username, email, coop, posto, sessoes) VALUES (?,?,?,?,?)', [data.username, data.email, data.coop, data.posto, data.sessoes], doInsert.bind(this, onSuccess));
//     //     //     }else{
//     //     //         onSuccess();
//     //     //     }
//     //     // }
//     // }

//     // createDB()
// });