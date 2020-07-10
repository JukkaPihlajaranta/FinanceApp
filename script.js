
//INPUTS
const inputIncome = document.getElementById('inputIncome');
const newSpend = document.getElementById('spendName');
const colorPicker = document.getElementById('colorPicker');

//MISC ELEMENTS
const spendDiv = document.getElementById('spendDiv');
const result = document.getElementById('result');
const clearBtn = document.getElementById('clearBtn');

const exampleSpendArray = [{
    spendName: "Housing",
    spendValue: 800
},
{
    spendName: "Food",
    spendValue: 400
},
{
    spendName: "Entertaiment",
    spendValue: 90
},
{
    spendName: "Logistics",
    spendValue: 150
},
{
    spendName: "Misc",
    spendValue: 250
}];
let spendArray = [];


//LEGENDS && FIELDSETS
const inputFieldset = document.getElementById('inputFieldset');
const expensesFieldset = document.getElementById('expensesFieldset');

//CHART
const ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            label: '€',
            data: [],
            labels:[],
            backgroundColor: [
                'rgba(150, 255, 100, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(100, 100, 186, 0.7)',
                'rgba(99, 5, 255, 0.7)',

            ],
            borderColor: 'white',
            // borderColor: [
            //     'rgba(150, 255, 100, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(100, 100, 186, 1)',
            //     'rgba(99, 5, 255, 1)',
            // ],
            borderWidth: 1,
            hoverBorderWidth: 2,
            hoverBorderColor: "black"

        },

    ]
    },
    options: {
        rotation: 1*Math.PI,
        circumference: 1 * Math.PI,
        responsive: true,
        // layout: {
        //     padding: {
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         bottom: 0
        //     }
        // },
        title:{
            display: true,
            text: 'Monthly balance',
            fontFamily: 'Chelsea Market',
            fontSize: 16,
        },
        tooltips: {
            enabled: true,
            fontFamily: 'Chelsea Market',
            // callbacks: {
            //     label: function(tooltipItem, data) {
            //         var dataset = data.datasets[tooltipItem.datasetIndex];
            //         var index = tooltipItem.index;
            //         return dataset.labels[index] + ': ' + dataset.data[index];
            //     }
            // }
            callbacks:{
                beforeLabel  : function(tooltipItem, data){
                    
                    return data.labels[tooltipItem.index];
                },
                label : function(tooltipItem, data){
                    
                    return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + myChart.data.datasets[0].label;
                }
            }
        },
        legend:{
            display: true,
            position: 'bottom',
            labels:{
                fontColor: 'black',
                
                fontFamily: 'Chelsea Market',
            },

        }
    }
});


InStart();
UpdateCharts();

//OPENS EXAMPLE ARRAY OR LAST SAVED ARRAY
function InStart(){

    if (localStorage.getItem('financeApp')){
        spendArray = JSON.parse(localStorage.getItem('financeApp'))
        

        for (var item in spendArray){
            const tempNewSpend = document.createElement('div');
            
            
            tempNewSpend.id = spendArray[item].id;
            tempNewSpend.className = "rowDiv";
            tempNewSpend.innerHTML = `<div class="colorBlock" style="background: ${spendArray[item].color};"></div>
                <div class="startElement"> ${spendArray[item].spendName}</div>
                <input type='number' min="0" placeholder='? €' value="${spendArray[item].spendValue}">
                <button onclick='RemoveSpend(${spendArray[item].id})' 
                class='btn red'>-</button> `;

            spendDiv.appendChild(tempNewSpend);
            inputIncome.value = spendArray[item].income;
            
        }
    }

    else{
        spendArray = [...exampleSpendArray];

        for (var i = 0; i < spendArray.length; i++){
            const tempNewSpend = document.createElement('div');
            const randomId = Math.floor(Math.random()*10000000);
            const randomColor = `rgba(${Math.floor(Math.random()*80)},${Math.floor(Math.random()*80)} , ${Math.floor(Math.random()*256)}, 0.7 )`;

            tempNewSpend.id = randomId;
            tempNewSpend.className = "rowDiv";
            tempNewSpend.innerHTML = `<div class="colorBlock" style="background: ${randomColor};"></div>
                <div class="startElement"> ${spendArray[i].spendName}</div>
                <input type='number' min="0" placeholder='? €' value="${spendArray[i].spendValue}">
                <button onclick='RemoveSpend(${randomId})' 
                class='btn red'>-</button>`;
    
            spendDiv.appendChild(tempNewSpend);
            
            
    
            spendArray[i].id = randomId;
            spendArray[i].color = randomColor;
    
            inputIncome.value = 1900;
            clearBtn.style = "display: none";
        }
    }
    

};

//ADDS NEW SPEND
function NewSpend(){
    

    if (newSpend.value != '' && spendArray.length < 11){
        
        const tempNewSpend = document.createElement('div');
        const randomId = Math.floor(Math.random()*10000000);
        tempNewSpend.id = randomId;
        tempNewSpend.className = "rowDiv";
        tempNewSpend.innerHTML = `<div class="colorBlock" style="background: ${colorPicker.value};"></div>
            <div class="startElement">${truncate(newSpend.value,13)}</div>
            <input type='number' value='0' placeholder='? €'>
            <button onclick='RemoveSpend(${randomId})' 
            class='btn red'>-</button>`;
        
        spendArray.push({spendName: newSpend.value, income: inputIncome.value, spendValue: 0, id: randomId, color: colorPicker.value});
        spendDiv.appendChild(tempNewSpend);
        newSpend.value = '';
        
        gsap.from(tempNewSpend, {duration: 0.8, x: -30, opacity: 0})
    }
    
    
};

//REMOVES A SPEND FROM ARRAY
function RemoveSpend(id){

    if (spendArray.length > 0){

        for (var el in spendArray){
            if (spendArray[el].id == id){
                
                spendArray.splice(el, 1);
                break;
            }
        }
        
        const elementToRemove = document.getElementById(id);
        gsap.to(elementToRemove, {duration: 0.5, opacity: 0, x: 40, clearProps: 'all'})
        setTimeout(() => {
            elementToRemove.parentNode.removeChild(elementToRemove);    //removes the element
            UpdateCharts(); //update chart
        }, 500);
        
    }
};


function SaveAndClear(option){
    
    switch (option){
        case 'save':
            localStorage.setItem('financeApp', JSON.stringify(spendArray));
            // console.log(localStorage.getItem('financeApp'));
            clearBtn.style = "display: flex";
            break;

        case 'clear':
            localStorage.clear();
            break;
    }

    if (!localStorage.getItem('financeApp')){
        clearBtn.style = "display: none";
    }
};


//UPDATE WHOLE CHART
function UpdateCharts(){
   

    let spendNames = [];
    let spendValues = [];
    let spendColors = [];
    let spendTotal = 0;
    const income = inputIncome.value;

    for (var item in spendArray){
        spendNames.push(spendArray[item].spendName);

        const element = document.getElementById(spendArray[item].id);
        // console.log(element);
        
        spendTotal += element.children[2].valueAsNumber; //calculate total
        spendArray[item].spendValue = element.children[2].valueAsNumber;
        spendArray[item].income = inputIncome.value;

        spendValues.push(element.children[2].valueAsNumber); //to chart list
        spendColors.push(spendArray[item].color); // to chart list
    }

    let difference = income - spendTotal;

    //deficit
    if (difference < 0){
        spendValues.push(Math.abs(difference));
        spendNames.push('Deficit'); //push as last variable
        spendColors.push('red'); //push as last variable

        //Change colors for borders
        inputFieldset.className = 'inputFields lightgreen';
        expensesFieldset.className = "inputFields red";
        result.className = "result red";

        gsap.from(result, {color:'gray', duration: 0.8, y:50, opacity: 0, clearProps: 'all'});
        
        ShowResult(difference, Math.round((Math.abs(difference)/spendTotal)*100), 'red');
    }

    //surplus
    else{
        spendValues.push(Math.abs(difference));
        spendNames.push('Surplus'); //push as last variable
        spendColors.push('green'); //push as last variable

        //Change colors for borders
        inputFieldset.className = 'inputFields green';
        expensesFieldset.className = "inputFields lightred";
        result.className = "result green";

        gsap.from(result, {color:'gray', duration: 0.8, y:50, opacity: 0, clearProps: 'all'});
        
        ShowResult(difference, Math.round((difference/income)*100), 'green');
    }
    
    
    //UPDATE CHART
    myChart.data.labels = spendNames;
    myChart.data.datasets[0].labels = spendNames;
    myChart.data.datasets[0].data = spendValues;
    myChart.data.datasets[0].backgroundColor = spendColors;

    myChart.update();
};


//RESULT TEXT IN BOTTOM
function ShowResult(difference, math, theme){

    switch (theme){
        case 'green':
            result.innerHTML = `Your current balance is ${difference}€/month <br>
                            You are able to save ~${math}% of what you earn.`;
            break;
        
        case 'red':
            result.innerHTML = `Your current balance is ${difference}€/month! <br>
                            You're spending ~${math}% over your monthly budget.`;
        break;

    }
};

//LIMIT TEXT LENGTH
function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};
