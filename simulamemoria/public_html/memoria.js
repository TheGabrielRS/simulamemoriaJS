window.onload = function iniciaSimulacao()
{
    //OBJETO PAGINA
    function Pagina(){
        this.inicializa = function(){
            divLogica.innerHTML = memorias[0].montaTabela();
            divCache.innerHTML = memorias[1].montaTabela();
            divRAM.innerHTML = memorias[2].montaTabela();
            divProcessador.innerHTML = '<table><tr><td>' + "Nenhuma palavra" + '</td></tr></table>';
        },
        this.atualiza = function(){
            divRAM.innerHTML = ram.montaTabela();
            hits.innerHTML = logica.hit;
            miss.innerHTML = logica.miss;
           // setTimeout(function(){
                divCache.innerHTML = cache.montaTabela();
                divProcessador.innerHTML = '<table><tr><td width="250" align="center">' + processador.palavraAtual + '</td></tr></table>';
           // }, 2000);
        };
    }
    
    //OBJETO MEMORIA
    function Memoria(hierarquia,tamanho){
        this.hierarquia = hierarquia,
        this.tamanhoMemoria = tamanho,
        this.memoria = [],
        this.popula = function(){
                for(var x = 0; x < this.tamanhoMemoria; x++)
                {
                    this.memoria[x] = [];
                    for (var y=0; y < this.tamanhoMemoria; y++){
                        this.memoria[x][y] = ["",(Math.floor((Math.random() * 20)) + 1)];
                        for(z = 0; z<8; z++){
                            //Popula com bits aleatórios (VALIDADE|MODIFICAÇÃO|DADOS)
                            this.memoria[x][y][0] += (Math.floor((Math.random() * 2))).toString();
                        }
                    }
                }
            }
        this.popula(),
        this.montaTabela = function(){
            var tabela = '';
            tabela += '<table id="tabelaCache" border="1" style="width: 100%">';
            for(var i in this.memoria)
            {   
                tabela += '<tr>';
                for(var k in this.memoria[i]){
                    tabela += '<td>'+i+" "+k+"|"+this.memoria[i][k]+'</td>';
                }
                tabela += '</tr>';
            }
            tabela += '</table>';
            return tabela;
        },
        
        
        this.retornaProcessador = function(pos){
            var validade = false;
            var posFisica = new Array(this.memoria[pos[0]][pos[1]][0].charAt(0),this.memoria[pos[0]][pos[1]][0].charAt(1));
            var blocoMemoria = cache.memoria[posFisica[0]][posFisica[1]][0];
            
            if(blocoMemoria.charAt(0) == 1){
                processador.palavraAtual = blocoMemoria;
                validade = true;
            }else{
                var novoBloco = this.resgataRAM(posFisica);
                novoBloco = this.substituiChar(novoBloco,0,"1");
                processador.palavraAtual = novoBloco;
                cache.memoria[posFisica[0]][posFisica[1]][0] = novoBloco;
            }
            return validade;
        },
        
        function substituiChar(str,pos,char){
            p1 = str.substring(0,pos-1);
            p2 =str.substring(pos,str.length);
            return p1+char+p2;
        },
        
        this.resgataRAM = function(pos){
            var blocoMemoria = cache.memoria[pos[0]][pos[1]][0];
            var blocoProxMemoria = ram.memoria[pos[0]][pos[1]][0];
            
            if(blocoProxMemoria.charAt(0) == 1)
                blocoMemoria = blocoProxMemoria;
            else
                return "ERRO CRÍTICO";
            return blocoMemoria;
        },
        
        this.substituiBit = function(str,index,chr) {
            if(index > str.length-1) 
                return str;
            return str.substr(0,index) + chr + str.substr(index+1);
        }
    }


    function Logica(){
        this.hit = 0,
        this.miss = 0,
        this.memoria = [],
        this.populaLogica = function(){
            var cont = Number();
            for(var x in arguments)
            {
                this.memoria[x] = []
                for(var y in arguments[x].memoria)
                {
                    this.memoria[x][y] = [];
                    for(var z in arguments[x].memoria[y])
                    {
                        this.memoria[x][y][z] = arguments[x].memoria[y][z];
                    }   
                }
            }
        },
        
        this.montaTabela = function(){
            var tabela = '';
            tabela += '<table id="tabelaCache" border="1">';
            for(var i in this.memoria)
            {   
                for(var j in this.memoria[i])
                {
                    tabela += '<tr>';
                    for(var k in this.memoria[i][j]){
                        tabela += '<td>'+i+" "+j+" "+k+'</td>';
                }
                tabela += '</tr>';
                }
            }
            tabela += '</table>';
            return tabela;
        },
        
        this.escreveCache = function(pos,dado){
            var validade = false;
            var blocoMemoria = cache.memoria[pos[0]][pos[1]][0];

            cache.memoria[pos[0]][pos[1]][0] = dado+"";
            
            return validade;
        },
        
        this.retornaProcessador = function(pos)
        {
            if(this.memoria[pos[0]][pos[1]][pos[2]][0].charAt(0) == 0){
                this.miss++;
                processador.palavraAtual = "Palavra Inválida";
            }else{
                this.hit++;
                processador.palavraAtual = this.memoria[pos[0]][pos[1]][pos[2]][0];
            }
            return this.memoria[pos[0]][pos[1]][pos[2]];
        }
    }
    
    //OBJETO PROCESSADOR 
    function Processador(){
        var palavraAtual;
        var hit;
        var miss;
        this.atualizaMemoria = function(hierarquia, memoriaDestino, memoriaOrigem, dadoPos)
        {
            if(hierarquia > 0)
            {   //Recebe qual a posição possui o LRU na memória enviada para a função
                var lru = this.verificaLRU(memoriaDestino);
                var dado = logica.retornaProcessador(dadoPos);
                temp = memoriaDestino.memoria[lru[1]][lru[2]];
                memoriaDestino.memoria[lru[1]][lru[2]] = dado;
                memoriaOrigem.memoria[dadoPos[1]][dadoPos[2]] = temp;
            }
        }
        this.verificaLRU = function() //Varre o array de memórias passado como parâmetro, retornando a posição onde há o LRU
        {
            var lru = [Number.MIN_VALUE];
            for(var i in arguments[0])
                for(var j in arguments[0][i])
                    for(var k in arguments[0][i][j])
                        if(arguments[0][i][j][k][1] > lru[0])
                        {
                            lru[0] = arguments[0][i][j][k][1]; //Valor do LRU
                            lru[1] = j; //Coordenadas da matriz para a posição de LRU
                            lru[2] = k; //idem acima
                            lru[3] = arguments[0][i][j][k][0]; //valor do espaço de memoria
                        }
            lru[0] = 1;
            return lru;
        }
        this.aleatorio = function(){
            var vezes = interacoes.value;
            var cont = 0;
            
            while(cont < vezes){
                setTimeout(function(){
                    randomVect = new Array(Math.floor((Math.random() * 2)), Math.floor((Math.random() * 3)), Math.floor((Math.random() * 3)));
                    if(randomVect[0] > 0)
                    {
                        processador.atualizaMemoria(ram.hierarquia, cache, ram, randomVect);
                    }
                    else
                    {
                        logica.retornaProcessador(randomVect);
                    }
                    console.log(cont);
                    pagina.atualiza();
                }, velocidade.value*cont);
                cont++;
                console.log(cont<vezes);
                pagina.atualiza();
            }
            
            
        }
    }

    
    var pagina = new Pagina();
    var processador = new Processador();
    var memorias = [logica = new Logica(), cache = new Memoria(0,3), ram = new Memoria(1,3)];
    
    logica.populaLogica(cache, ram);

    pagina.inicializa();
    
    //USUÁRIO
    document.getElementById('botao').onclick = function() {
        if(document.getElementById('posx').value == 1)
        {
            processador.atualizaMemoria(ram.hierarquia, cache, ram, Array(document.getElementById('posx').value,document.getElementById('posy').value,document.getElementById('posz').value));
        }
        else
        {
            logica.retornaProcessador(Array(document.getElementById('posx').value,document.getElementById('posy').value,document.getElementById('posz').value));
        }
            
        pagina.atualiza();
    }
    
    document.getElementById('botao2').onclick = function() {
        logica.escreveCache(Array(document.getElementById('posx2').value,document.getElementById('posy2').value), document.getElementById('dado').value);
        
        pagina.atualiza();
    }
    
    document.getElementById('botao3').onclick = function() { 
        processador.aleatorio();
    }
};