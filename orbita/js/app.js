
$( document ).ready(function() {
    
    // Configuraçoes
    
    var orbitaURL   = "data.json";
    var db          =  openDatabase('dados', '1.0', 'orbita analytics', 2 * 1024 * 1024);
    var dataPeriodo = "17/09/2020 - 15/11/2020"

    // Gerador de resultados

    db.transaction(function (tx) {

        // Cria a tabela para consulta local, possibilitando a query de resultados por cooperativa

        tx.executeSql('CREATE TABLE IF NOT EXISTS DATA (id INTEGER PRIMARY KEY, coop INTEGER, sessoes INTEGER, username TEXT, email TEXT, posto TEXT)'); 

        // Recebe os dados (Por enquanto estão estáticos, mas será gerado uma versão que receberá diretamente do Big Query do Google)

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
                    
                    // Insere no iput

                    for (; i < len; i = i + 1) {
                        $('#selectCoop').append('<option value="'+results.rows.item(i).coop+'">'+results.rows.item(i).coop+'</option>');
                    }
                 }, null);
             });

        });

    });

    // Seleção de cooperativa na lista

    function selecionaCoop(valor){
        db.transaction(function (transaction) {   

            // Query dos resultados somente da cooperativa selecionada

            transaction.executeSql("SELECT * FROM DATA WHERE coop = '"+valor+"'" , [], function (tx, results) {
                var len = results.rows.length; 
                var i=0;
                usuarios = [];
                for (; i < len; i = i + 1) {
                    usuarios[i] = results.rows.item(i);
                }

                // Insere o ID da cooperativa na listagem

                $('#coopId').html(valor);

                // Insere a data e o periodo do report

                $('#periodo').html(dataPeriodo);

                // Gera a tabela de resultados

                $('#table').bootstrapTable({
                    exportTypes: ['excel', 'pdf', 'txt'],
                    export: 'glyphicon-export icon-share',
                    data: usuarios
                });
             }, null);
         });

        //  Mostra os resultados ao usuário

         $('.unicred-select-coop').fadeOut('200');
         $('.unicred-show-report').fadeIn('200');
    }

    // Call para mostrar resultados

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

    // Botão voltar

      $('#voltar').click(function(e) {
        document.location.reload(true);
    });
});
