window.onload = function iniciaSimulacao()
{
    //OBJETO PAGINA
    function Pagina(){
        this.inicializa = function(){
            divLogica.innerHTML = mLogica.montaTabela();
            divCache.innerHTML = memorias[1].montaTabela();
            divRAM.innerHTML = memorias[2].montaTabela();
            divProcessador.innerHTML = '<table id="tabelaCache"><tr><td>' + "Nenhuma palavra" + '<td><tr></table>';
        },
        this.atualiza = function(){
            divRAM.innerHTML = ram.montaTabela();
            setTimeout(function(){
                console.log("teste");
                divCache.innerHTML = cache.montaTabela();
                divProcessador.innerHTML = '<table id="tabelaCache"><tr><td>' + processador.palavraAtual + '<td><tr></table>';
            }, 2000);
        };
    }
    
    //OBJETO MEMORIA
    function Memoria(logica,tamanho){
        this.logica,
        this.tamanhoMemoria = tamanho,
        this.memoria = [],
        this.popula = function(){
            if(logica){
                for(var x = 0; x < this.tamanhoMemoria; x++)
                {
                    //MMU MAPEAMENTO
                    this.memoria[x] = [];
                    for (var y=0; y < this.tamanhoMemoria; y++){
                        this.memoria[x][y] = [""];
                        for(z = 0; z<2; z++){
                            this.memoria[x][y][0] += (Math.floor((Math.random() * 3))).toString();
                        }
                    }
                }
            }else{
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
        },
        this.popula(),
        this.montaTabela = function(){
            var tabela = '';
            tabela += '<table id="tabelaCache" border="1">';
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
        
        this.escreveCache = function(pos,dado){
            var validade = false;
            var posFisica = new Array(this.memoria[pos[0]][pos[1]][0].charAt(0),this.memoria[pos[0]][pos[1]][0].charAt(1));
            var blocoMemoria = cache.memoria[posFisica[0]][posFisica[1]][0];
            
            if(blocoMemoria.charAt(0) == 1){
                console.log("blocoMemoria - "+blocoMemoria);
                validade = true;
                cache.memoria[posFisica[0]][posFisica[1]][0] = dado;
            }else{
                //MISS?
            }
            
            return validade;
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
                processador.palavraAtual = novoBloco;
                cache.memoria[posFisica[0]][posFisica[1]][0] = novoBloco;
            }
            return validade;
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
                        tabela += '<td>'+i+" "+j+" "+k+"|"+this.memoria[i][j][k]+'</td>';
                }
                tabela += '</tr>';
                }
            }
            tabela += '</table>';
            return tabela;
        },
        this.retornaProcessador = function()
        {
            // console.log(arguments);
            console.log(this.memoria[arguments[0][0]][arguments[0][1]][arguments[0][2]]);
            processador.palavraAtual = this.memoria[arguments[0][0]][arguments[0][1]][arguments[0][2]][0];
            // console.log(this.memoria[pos[1]][pos[2]][pos[3]]);
            // console.log(dado);
        }
    }
    
    //OBJETO PROCESSADOR 
    function Processador(){
        var palavraAtual;
    }

    var pagina = new Pagina();
    var processador = new Processador();
    var memorias = [logica = new Memoria(1,6), cache = new Memoria(0,3), ram = new Memoria(0,3)];


    mLogica = new Logica();
    mLogica.populaLogica(cache, ram);

    pagina.inicializa();
    
    //USUÁRIO
    document.getElementById('botao').onclick = function() {
        mLogica.retornaProcessador(Array(document.getElementById('posx').value,document.getElementById('posy').value,document.getElementById('posz').value));
        pagina.atualiza();
    }
    
    document.getElementById('botao2').onclick = function() {
        logica.escreveCache(Array(document.getElementById('posx2').value,document.getElementById('posy2').value), document.getElementById('dado').value);
        pagina.atualiza();
    }
};