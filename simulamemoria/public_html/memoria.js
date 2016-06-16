


window.onload = function iniciaMemoria()
{
    function Memoria(tamanho){
        this.tamanhoMemoria = tamanho,
        this.memoria = [],
        this.popula = function(){
                        for(var x = 0; x < this.tamanhoMemoria; x++)
                        {
                            this.memoria[x] = [];
                            for (var y=0; y < this.tamanhoMemoria; y++)
                                this.memoria[x][y] = y;
                        }
        },
        this.popula(),
        this.montaTabela = function()
        {
            var tabela = '';
            tabela += '<table id="tabelaCache" border="1">';
            this.memoria.forEach(function(valorMemoria, index, pagina)
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
        },
        this.verificaPosicao = function(posicao)
        {
            var flag = [];
            posicao.forEach(function(valor, index)
            {
                if(valor <= this.tamanhoMemoria)
                    flag[index] = 1;
                console.log('Primeiro foreach --tamanho da memoria-- '+this.tamanhoMemoria);  
            },this);
            var soma;
            flag.forEach(function(valor, index)
            {
                soma = flag[index];
            });
            console.log('Soma '+soma);
            if((soma / flag.length) == 1)
                return true;
            else
                return false;
        }
        this.verificaMemoria = function(posicao)
        {
            if(this.verificaPosicao(posicao))
                return this.memoria[posicao[0]][posicao[1]];
            else
                return null;
        };

    } 
    
    var cache = new Memoria(10);

    console.log(cache.tamanhoMemoria);

    console.log(cache.verificaMemoria(Array(1,1)));


    
	divCache.innerHTML = cache.montaTabela();
};