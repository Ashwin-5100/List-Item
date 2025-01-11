document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];

    fetch('/api/expenses')
        .then(response => response.json())
        .then(data => {
            expenses = data;
            displayExpenses(expenses);
            updateTotalAmount();
        })
        .catch(error => console.error('Error fetching expenses:', error));

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;


        const expense = { name, amount, category, date };


        fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        })
            .then(response => response.json())
            .then(newExpense => {
                expenses.push(newExpense);
                displayExpenses(expenses);
                updateTotalAmount();
                expenseForm.reset();
            })
            .catch(error => console.error('Error adding expense:', error));
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.dataset.id;


            fetch(`/api/expenses/${id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    expenses = expenses.filter(expense => expense.id != id);
                    displayExpenses(expenses);
                    updateTotalAmount();
                })
                .catch(error => console.error('Error deleting expense:', error));
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = e.target.dataset.id;
            const expense = expenses.find(expense => expense.id == id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;


            expenses = expenses.filter(expense => expense.id != id);
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
});
