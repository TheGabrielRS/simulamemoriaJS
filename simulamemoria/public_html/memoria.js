


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
            var tabela;
            this.memoriaCache.forEach(function()
            {
                tabela += '<table>';
                for(var x=0; x < this.tamanhoCache; x++)
                {
                    tabela += '<tr>';
                    for(var y=0; y < this.tamanhoCache; y++)
                        tabela += '<td>'+this.memoriaCache[x][y]+'</td>';
                    tabela += '</tr>';
                }
                tabela += '</table>';
            });
            return tabela;
        };
    } 
    
    var controlador = new ControladorCache(5);
    
    console.log(controlador.memoriaCache);
    
    console.log(controlador.montaTabela());
    
    document.write(controlador.montaTabela());
};