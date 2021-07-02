const UlTransacoes = document.querySelector("#transactions")
const DivReceita = document.querySelector("#money-plus")
const DivDespesa = document.querySelector("#money-minus")
const DivBalanco = document.querySelector("#balance")
const form = document.querySelector('#form')
const inputNomeTransacao = document.querySelector('#text')
const inputValorTransacao = document.querySelector('#amount')
const svg = '<svg fill="#00" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="15px" height="15px"><path d="M 10.3125 -0.03125 C 8.589844 -0.03125 7.164063 1.316406 7 3 L 2 3 L 2 5 L 6.96875 5 L 6.96875 5.03125 L 17.03125 5.03125 L 17.03125 5 L 22 5 L 22 3 L 17 3 C 16.84375 1.316406 15.484375 -0.03125 13.8125 -0.03125 Z M 10.3125 2.03125 L 13.8125 2.03125 C 14.320313 2.03125 14.695313 2.429688 14.84375 2.96875 L 9.15625 2.96875 C 9.296875 2.429688 9.6875 2.03125 10.3125 2.03125 Z M 4 6 L 4 22.5 C 4 23.300781 4.699219 24 5.5 24 L 18.59375 24 C 19.394531 24 20.09375 23.300781 20.09375 22.5 L 20.09375 6 Z M 7 9 L 8 9 L 8 22 L 7 22 Z M 10 9 L 11 9 L 11 22 L 10 22 Z M 13 9 L 14 9 L 14 22 L 13 22 Z M 16 9 L 17 9 L 17 22 L 16 22 Z"/></svg>'

form.addEventListener('submit', EnvioDoFormulario)

const TransacoesNoArmazenamentoLocal = JSON.parse(localStorage
    .getItem('transacoes'))
let transacoes = localStorage
    .getItem('transacoes') !== null ? TransacoesNoArmazenamentoLocal : []

function removerTransacao(id){
    /* return console.log('o'); */
    transacoes = transacoes.filter(transacoes => {
        return transacoes.id !== id
    })
    atualizarArmazentamentoLocal();
    init();
    funcoesBtnDelete()
}

function atualizarArmazentamentoLocal(){
    localStorage.setItem('transacoes', JSON.stringify(transacoes))
}


function EnvioDoFormulario(event){

    event.preventDefault()

    const NomeTransacao = inputNomeTransacao.value.trim();
    const ValorTransacao = inputValorTransacao.value.trim();
    const InputVazio = NomeTransacao === "" || ValorTransacao === ""

    if(InputVazio){
        alert('Por favor, preencha os dados da transação!')
        return
    }

    arrayDeTransacoes(NomeTransacao, ValorTransacao)
    init()
    atualizarArmazentamentoLocal()
    funcoesBtnDelete();
    limparInputs();

}
const limparInputs = () => {
    inputValorTransacao.value = ""
    inputNomeTransacao.value = ""
  }

function arrayDeTransacoes(NomeTransacao, ValorTransacao){
    transacoes.push({
        id: generateID(),
        nome: NomeTransacao,
        valor: Number(ValorTransacao),
    })
}

function generateID(){
    return Math.round(Math.random() * 1000)
}

function init(){
    UlTransacoes.innerHTML = "";
    transacoes.forEach(adicionarTransacoesAoDom)
    atualizarBalanco();
}
init();

function atualizarBalanco(){
    const ValoresTransacoes = transacoes.map(({valor}) => valor)
    const total = pegarOTotal(ValoresTransacoes)
    const despesas = pegarADespesa(ValoresTransacoes)
    const receita = pegarOLucro(ValoresTransacoes)

    /* console.log({total, despesas,receita}); */
    /* console.log(ValoresTransacoes); */

    DivBalanco.textContent = `R$ ${total}`
    DivDespesa.textContent = `R$ ${despesas}`
    DivReceita.textContent = `R$ ${receita}`
}

function pegarOTotal(ValoresTransacoes){
    return ValoresTransacoes.reduce((acumulador, valor) => acumulador + valor, 0).toFixed(2)
}

function pegarADespesa(ValoresTransacoes){
    const a = ValoresTransacoes.filter(valor => valor < 0);
    const b = a.reduce((acumulador, valor) => {
        return acumulador + valor
    }, 0)
    const c = b.toFixed(2)
    return c;

    /* return ValoresTransacoes.toFixed(2) */
    Math.abs(ValoresTransacoes
        .filter(valor => valor < 0)
        .reduce((acumulador, valor) => acumulador + valor, 0))
        .toFixed(2)
}

function pegarOLucro(ValoresTransacoes){
    const a = ValoresTransacoes.filter(valor => valor > 0)
    const b = a.reduce((acumulador, valor) =>{
        return acumulador + valor
    }, 0)
    const c = b.toFixed(2)
    return c;
        /* .reduce((acumulador, valor) => acumulador + valor, 0)
        .toFixed(2) */
}

function adicionarTransacoesAoDom({valor, nome, id}){
    const operador = valor < 0 ? "-" : "+"
    const ClasseCSS = valor < 0 ? "minus" : "plus"
    const valoresComOperador = Math.abs(valor)
    const li = document.createElement('li')

    li.classList.add(ClasseCSS, 'transacao-filho')
    li.innerHTML = `
        ${nome} 
    <span class="valor">${operador} R$${valoresComOperador}</span>
    <button class="delete-btn ocultar" onclick="removerTransacao(${id})">
      ${svg}
    </button>
    `
    UlTransacoes.append(li)
}

