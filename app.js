import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    // ඔබේ Firebase Config මෙතනට ඇතුළත් කරන්න
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. ගිණුම් ලැයිස්තුව සහ වර්ගීකරණය
const chartOfAccounts = [
    { name: "Cash", type: "Asset" },
    { name: "Bank", type: "Asset" },
    { name: "Sales", type: "Income" },
    { name: "Purchases", type: "Expense" },
    { name: "Electricity", type: "Expense" },
    { name: "Capital", type: "Equity" },
    { name: "Creditors", type: "Liability" }
];

// Dropdowns පිරවීම
function populateDropdowns() {
    const dr = document.getElementById('debitAcc');
    const cr = document.getElementById('creditAcc');
    chartOfAccounts.forEach(acc => {
        let opt = `<option value="${acc.name}">${acc.name}</option>`;
        dr.innerHTML += opt; cr.innerHTML += opt;
    });
}

// 2. දත්ත සුරැකීම
window.saveTransaction = async () => {
    const data = {
        date: document.getElementById('date').value,
        desc: document.getElementById('desc').value,
        amount: parseFloat(document.getElementById('amount').value),
        debitAcc: document.getElementById('debitAcc').value,
        creditAcc: document.getElementById('creditAcc').value,
        timestamp: new Date()
    };

    await addDoc(collection(db, "transactions"), data);
    alert("ගනුදෙනුව සාර්ථකව ඇතුළත් කළා!");
    window.location.reload();
};

// 3. ප්‍රධාන එන්ජිම (Processing Engine)
async function processAccounts() {
    const q = query(collection(db, "transactions"), orderBy("date"));
    const snapshot = await getDocs(q);
    
    let ledgerData = {};
    chartOfAccounts.forEach(a => ledgerData[a.name] = { details: [], totalDr: 0, totalCr: 0 });

    snapshot.forEach(doc => {
        const t = doc.data();
        // Debit Entry
        ledgerData[t.debitAcc].details.push({ date: t.date, desc: t.desc, dr: t.amount, cr: 0 });
        ledgerData[t.debitAcc].totalDr += t.amount;
        // Credit Entry
        ledgerData[t.creditAcc].details.push({ date: t.date, desc: t.desc, dr: 0, cr: t.amount });
        ledgerData[t.creditAcc].totalCr += t.amount;
    });

    renderTrialBalance(ledgerData);
    renderFinancialStatements(ledgerData);
}

// 4. ශේෂ පිරික්සුම පෙන්වීම
function renderTrialBalance(data) {
    const body = document.getElementById('trial-body');
    for (let acc in data) {
        if (data[acc].totalDr > 0 || data[acc].totalCr > 0) {
            body.innerHTML += `<tr><td>${acc}</td><td>${data[acc].totalDr}</td><td>${data[acc].totalCr}</td></tr>`;
        }
    }
}

// 5. මූල්‍ය ප්‍රකාශන (P&L සහ Balance Sheet)
function renderFinancialStatements(data) {
    let income = 0, expense = 0, assets = 0, liabilities = 0, equity = 0;

    for (let accName in data) {
        const accInfo = chartOfAccounts.find(a => a.name === accName);
        const balance = data[accName].totalDr - data[accName].totalCr;

        if (accInfo.type === "Income") income += (data[accName].totalCr - data[accName].totalDr);
        if (accInfo.type === "Expense") expense += (data[accName].totalDr - data[accName].totalCr);
        if (accInfo.type === "Asset") assets += balance;
        if (accInfo.type === "Liability") liabilities -= balance;
        if (accInfo.type === "Equity") equity -= balance;
    }

    const netProfit = income - expense;
    document.getElementById('pl-body').innerHTML = `
        <p>මුළු ආදායම: ${income}</p>
        <p>මුළු වියදම: ${expense}</p>
        <hr><h5>ශුද්ධ ලාභය: ${netProfit}</h5>`;

    document.getElementById('bs-body').innerHTML = `
        <p>වත්කම්: ${assets}</p>
        <p>වගකීම්: ${liabilities}</p>
        <p>හිමිකම්: ${equity + netProfit}</p>
        <hr><h5>Total: ${assets} = ${liabilities + equity + netProfit}</h5>`;
}

populateDropdowns();
processAccounts();