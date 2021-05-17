const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const svg = '<svg fill="#00" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="15px" height="15px"><path d="M 10.3125 -0.03125 C 8.589844 -0.03125 7.164063 1.316406 7 3 L 2 3 L 2 5 L 6.96875 5 L 6.96875 5.03125 L 17.03125 5.03125 L 17.03125 5 L 22 5 L 22 3 L 17 3 C 16.84375 1.316406 15.484375 -0.03125 13.8125 -0.03125 Z M 10.3125 2.03125 L 13.8125 2.03125 C 14.320313 2.03125 14.695313 2.429688 14.84375 2.96875 L 9.15625 2.96875 C 9.296875 2.429688 9.6875 2.03125 10.3125 2.03125 Z M 4 6 L 4 22.5 C 4 23.300781 4.699219 24 5.5 24 L 18.59375 24 C 19.394531 24 20.09375 23.300781 20.09375 22.5 L 20.09375 6 Z M 7 9 L 8 9 L 8 22 L 7 22 Z M 10 9 L 11 9 L 11 22 L 10 22 Z M 13 9 L 14 9 L 14 22 L 13 22 Z M 16 9 L 17 9 L 17 22 L 16 22 Z"/></svg>'

const localStorageTransactions = JSON.parse(localStorage
  .getItem("transactions"))
let transactions = localStorage
  .getItem("transactions") !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction =>
    transaction.id !== ID)
  updateLocalStorage()
  init()
  funcoesBtnDelete();
}

const addTransactionIntoDom = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+"
  const CSSClass = amount < 0 ? "minus" : "plus"
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement("li")

  li.classList.add(CSSClass, 'transacao-filho')
  li.innerHTML = `
    ${name} 
    <span class="valor">${operator} R$${amountWithoutOperator}</span>
    <button class="delete-btn ocultar" onClick="removeTransaction(${id})">
      ${svg}
    </button>
  `
  transactionsUl.append(li)
}

const getExpenses = (transactionsAmounts) =>
  Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncomes = (transactionsAmounts) =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount)
  const total = getTotal(transactionsAmounts)
  const income = getIncomes(transactionsAmounts)
  const expense = getExpenses(transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ""
  transactions.forEach(addTransactionIntoDom)
  updateBalanceValues();
}

init()

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ""
  inputTransactionAmount.value = ""
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === "" || transactionAmount === ""

  if (isSomeInputEmpty) {
    alert("Por favor, preencha os dados da transação!")
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()
  funcoesBtnDelete();
  cleanInputs()
}

form.addEventListener("submit", handleFormSubmit)

/* Btn Delete */

const btnDelete = document.querySelectorAll('.delete-btn');
const btnEditarLista = document.querySelector('.editar-lista');
const valor = document.querySelectorAll('.valor');

const funcoesBtnDelete = () => {

  btnEditarLista.addEventListener('click', editarLista);

  function editarLista(){
    btnDelete.forEach((item)=> item.classList.toggle('ocultar'));
    valor.forEach((item)=> item.classList.toggle('ocultar'));
  }
}

funcoesBtnDelete();
