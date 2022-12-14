alert('Olá Seja bem vindo(a) a nossa Lista de Desejos!')

let InputNovaTarefa = document.querySelector ('#InputNovaTarefa')
let btnAddTarefa = document.querySelector ('#btnAddTarefa')
let listaTarefa = document.querySelector ('#listaTarefa')
let janelaEdicao = document.querySelector ('#janelaEdicao')
let janelaEdicaoFundo = document.querySelector ('#janelaEdicaoFundo')
let janelaEdicaoBtnFechar = document.querySelector ('#janelaEdicaoBtnFechar')
let btnAtualizarTarefa = document.querySelector ('#btnAtualizarTarefa')
let idTarefaEdicao = document.querySelector ('#idTarefaEdicao')
let inputTarefaNomeEdicao = document.querySelector ('#inputTarefaNomeEdicao')
let dbTarefas = [];

const KEY_CODE_ENTER = 13;
const KEY_LOCAL_STORAGE = 'listaDeTarefa';
obterTarefaLocalStorage();
rendenizarListaTarefaHTML();


InputNovaTarefa.addEventListener('keypress', (e) =>{

    if(e.keyCode == KEY_CODE_ENTER){
        let tarefa = {
            nome: InputNovaTarefa.value,
            id: gerarId(),
        }
        adicionarTarefa(tarefa);

    }
});

janelaEdicaoBtnFechar.addEventListener('click', (e) =>{
    alternarJanelaEdicao();
})

btnAddTarefa.addEventListener ('click', (e) =>{
    let tarefa = {
        nome: InputNovaTarefa.value,
        id: gerarId(),
    }
    adicionarTarefa(tarefa);
});

btnAtualizarTarefa.addEventListener('click', (e) =>{

    e.preventDefault();
    let idTarefa = idTarefaEdicao.innerHTML.replace('#', '');

    let tarefa = {
        nome: inputTarefaNomeEdicao.value,
        id: idTarefa
    }

    let tarefaAtual = document.getElementById('' + idTarefa + '');

    if(tarefaAtual){

        const indiceTarefa = obterIndiceTarefaPorId(idTarefa); 
        dbTarefas [indiceTarefa] = tarefa;
        salvarTarefaLocalStorage();

        let li = criarTagLI(tarefa);
        listaTarefa.replaceChild(li, tarefaAtual);
        alternarJanelaEdicao();

    }  
})

function gerarId(){
    return Math.floor(Math.random() * 3000);
}

function adicionarTarefa(tarefa){
    dbTarefas.push(tarefa)
    salvarTarefaLocalStorage();
    rendenizarListaTarefaHTML();
    
}

function criarTagLI(tarefa){
    
    let li = document.createElement('li');
    li.id = tarefa.id

    let span = document.createElement('span');
    span.classList.add('textoTarefa');
    span.innerHTML = tarefa.nome;

    let div = document.createElement('div');

    let btnEditar = document.createElement('button');
    btnEditar.classList.add('btnAcao');
    btnEditar.innerHTML = '<i class="fa fa-pencil"></i>';
    btnEditar.setAttribute('onclick', 'editar('+ tarefa.id+')')

    let btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btnAcao')
    btnExcluir.innerHTML = '<i class="fa fa-trash"></i>';
    btnExcluir.setAttribute('onclick', 'excluir('+ tarefa.id+')')

    div.appendChild(btnEditar);
    div.appendChild(btnExcluir);


    li.appendChild(span);
    li.appendChild(div);
    return li;

}

function editar(idTarefa){


    let li = document.getElementById(''+ idTarefa + '');
    if(li){
        idTarefaEdicao.innerHTML ='#' + idTarefa;
        inputTarefaNomeEdicao.value = li.innerText
        alternarJanelaEdicao();
    } else{
        alert('Desejo não encontrado!');
    }

    
}

function excluir(idTarefa){

    let confirmacao = window.confirm('Tem certeza que desejá excluir esse desejo?');
    if (confirmacao){

        const indiceTarefa = obterIndiceTarefaPorId(idTarefa); 
        dbTarefas.splice(indiceTarefa, 1);
        salvarTarefaLocalStorage();


        let li = document.getElementById(''+ idTarefa + '');
        if(li){
            listaTarefa.removeChild(li);
        }
    }  else{
        alert('Desejo não encontrado!');
    }
}

function alternarJanelaEdicao(){
    janelaEdicao.classList.toggle('abrir');
    janelaEdicaoFundo.classList.toggle('abrir');
}

function obterIndiceTarefaPorId(idTarefa){
    const indiceTarefa = dbTarefas.findIndex(t => t.id == idTarefa);
    if(indiceTarefa < 0){
        throw new Error('Id do desejo não encontrado:', idTarefa)
    }
    return indiceTarefa;



}
function rendenizarListaTarefaHTML(){
    listaTarefa.innerHTML = '';
    for (let i=0; i < dbTarefas.length; i++){

        let li = criarTagLI(dbTarefas[i]);
        listaTarefa.appendChild(li);
    }

    
    InputNovaTarefa.value = '';

}

function salvarTarefaLocalStorage(){
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(dbTarefas))
}

function obterTarefaLocalStorage(){
    if(localStorage.getItem(KEY_LOCAL_STORAGE)){
        dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
    }
}