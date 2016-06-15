


window.onload = function iniciaMemoria()
{
    function ControladorCache(tamanhoCache){
        this.tamanhoCache = tamanhoCache,
        this.memoriaCache = [],
        this.populaCache = function(){
                        for(var x = 0; x < this.tamanhoCache; x++)
                        {
                            this.memoriaCache[x] = [];
                            for (var y=0; y < this.tamanhoCache; y++)
                                this.memoriaCache[x][y] = y;
                        }
                            },
        this.populaCache(),
        this.montaTabela = function()
        {
            var tabela = '';
            tabela += '<table id="tabelaCache">';
            this.memoriaCache.forEach(function(valorMemoria, index, pagina)
            {   
	            tabela += '<tr>';
	            valorMemoria.forEach(function(valorPosicao)
	            {
	            	tabela += '<td>'+valorPosicao+'</td>';
	            });
	            tabela += '</tr>';
            });
            tabela += '</table>';
        	return tabela;
        };

    } 
    
    var controlador = new ControladorCache(5);
    
    console.log(controlador.memoriaCache);

    console.log(controlador.montaTabela());
    
	divCache.innerHTML = controlador.montaTabela();
};