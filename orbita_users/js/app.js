
$( document ).ready(function() {
    dados = [];
    $.getJSON( "https://raw.githubusercontent.com/rogercamara/rogercamara.github.io/master/datatest.json", function( data ) {
    //console.log(data);
        // dados.push(data)
       
        var total = data.length; 
        var i=0;
        usuarios = [];
        
        for (; i < total; i = i + 1) {
            usuarios[i] = data[i];
        }

        $('#table').bootstrapTable({
            exportTypes: ['excel', 'pdf', 'txt'],
            export: 'glyphicon-export icon-share',
            data: usuarios
        });
    });
});
