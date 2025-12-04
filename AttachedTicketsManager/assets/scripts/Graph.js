class Graph{
    constructor(){

    }
    daysAgo(inputDate){
        const dateInDays=new Date(inputDate).toISOString().split('T')[0]
        const millisecondsInADay=86400000
        const today=new Date();
        const dateToCheck=new Date(dateInDays);
        const numberOfDaysAgo=Math.floor((today.getTime()-dateToCheck.getTime())/millisecondsInADay);
        return numberOfDaysAgo;
    }
    sortTicketsByDay(tickets){
        const sortedTickets = tickets.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const ticketsBatchedByDay = sortedTickets.reduce((accumulator, currentItem) => {
            const dateKey = new Date(currentItem.created_at).toISOString().split('T')[0];

            if (!accumulator[dateKey]) {
                accumulator[dateKey] = [];
            }

            accumulator[dateKey].push(currentItem);

            return accumulator;
        }, {});
        const result = Object.keys(ticketsBatchedByDay).map(day => {
            return {
                day: day,
                times: ticketsBatchedByDay[day]
            };
        });
        return result;
    }
    ticketDataDisplayBox(){
        // the next order of business is to add the display box which will show end users the number of tickets represented in each bar
        //if a user clicks on it afterwords, it will take that day's data into a list below the graph, which contains more information about each ticket
        //including a link to each individual one.
        //the popup should also tell a user 
        const displayBox=document.createElement("div");
    }
    createYAxisLabels(numberOfIterations, positiveQuantityContainer, negativeQuantityContainer){
        if(numberOfIterations<0){
            for(let i=0; i<-numberOfIterations; i+= Math.ceil(-numberOfIterations/2)){
                const quantityLabel=document.createElement("span");
                quantityLabel.textContent=Math.floor(-numberOfIterations/2)+i;
                negativeQuantityContainer.appendChild(quantityLabel)
            }
        }else{
            for(let i=0; i<numberOfIterations; i += Math.ceil(numberOfIterations/2)){
                const quantityLabel=document.createElement("span");
                quantityLabel.textContent=(numberOfIterations)-i;
                positiveQuantityContainer.appendChild(quantityLabel);
            }
        }
    }
    setGraphScale(numberOfFailedAttempts, numberOfSuccessfulAttempts){
        const positiveQuantityContainer=document.getElementById("positiveQuantityContainer");
        const negativeQuantityContainer=document.getElementById("negativeQuantityContainer");
        let failedScale;
        let successfulScale;
        if(numberOfFailedAttempts < 5){
            failedScale=5
            this.createYAxisLabels(-5, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfFailedAttempts < 10){
            failedScale=10
            this.createYAxisLabels(-10, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfFailedAttempts < 20){
            failedScale=20
            this.createYAxisLabels(-20, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfFailedAttempts < 50){
            failedScale=50
            this.createYAxisLabels(-50, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfFailedAttempts < 100){
            failedScale=100
            this.createYAxisLabels(-100, positiveQuantityContainer, negativeQuantityContainer)
        }
        if(numberOfSuccessfulAttempts < 5){
            successfulScale=5
            this.createYAxisLabels(5, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfSuccessfulAttempts < 10){  
            successfulScale=10
            this.createYAxisLabels(10, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfSuccessfulAttempts < 20){
            successfulScale=20
            this.createYAxisLabels(20, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfSuccessfulAttempts < 50){
            successfulScale=50
            this.createYAxisLabels(50, positiveQuantityContainer, negativeQuantityContainer)
        }else if(numberOfSuccessfulAttempts < 100){
            successfulScale=100
            this.createYAxisLabels(100, positiveQuantityContainer, negativeQuantityContainer)
        }
        return [failedScale, successfulScale]
    }
    formatChartData(tickets){
        //contains tickets grouped by day and then further divided by pass, and fail status
        const recentTicketsPassStatus=[]
        let numberOfSuccessfulAttempts=0;
        let numberOfFailedAttempts=0;

        const recentTickets = tickets.map((ticket)=>{
            if(this.daysAgo(ticket.day) <= 6){
                return ticket
            }
        }).filter(Boolean);
        //determine the scale of the result
        
        for(let i=0; i<recentTickets.length; i++){
            const day={passed: [], failed: []}
            
            recentTickets[i].times.forEach((time)=>{
                const passStatus=time.custom_fields.find((field) => field.id===40282490348187);
                if(passStatus.value === "pass"){
                    day.passed.push(time)
                }else if(passStatus.value ==="fail"){
                    day.failed.push(time)
                }
            });
            recentTicketsPassStatus.push(day)
            if(day.passed.length > numberOfSuccessfulAttempts){
                numberOfSuccessfulAttempts = day.passed.length;
            }
            if(day.failed.length > numberOfFailedAttempts){
                numberOfFailedAttempts = day.failed.length;
            }
        }
        const [failedScale, successfulScale]=this.setGraphScale(numberOfFailedAttempts, numberOfSuccessfulAttempts)


        function createCenterIndicator(scale, passStatus){
            const centerIndicator=document.createElement("span");
            centerIndicator.style.backgroundColor="#5C6970";
            centerIndicator.style.gridColumnStart="1";
            centerIndicator.style.gridColumnEnd="8";
            centerIndicator.style.gridRow=`${!passStatus ? 50-((scale%2)*10) : 50+((scale%2)*10)}`;
            centerIndicator.style.height="0.5px"
            return centerIndicator
        }
        positiveDataContainer.appendChild(createCenterIndicator(successfulScale, true))
        negativeDataContainer.appendChild(createCenterIndicator(failedScale, false))
        

        for(let i=0; i<recentTicketsPassStatus.length; i++){
            
            if(recentTicketsPassStatus[i].passed.length > 0){
                const successfulTests=document.createElement("span");
                successfulTests.classList.add("graph-item", "passed");
                successfulTests.id=recentTickets[i].day
                successfulTests.style.backgroundColor="#227E22"
                successfulTests.style.gridColumn=`${7-(this.daysAgo(recentTickets[i].day))}`;
                successfulTests.style.gridRowStart="105"
                
                successfulTests.style.gridRowEnd=`${100-((recentTicketsPassStatus[i].passed.length/successfulScale)*100)}`;
                positiveDataContainer.appendChild(successfulTests);
            }

            if(recentTicketsPassStatus[i].failed.length > 0){
                const failedTests=document.createElement("span");
                failedTests.classList.add("graph-item", "failed");
                failedTests.id=recentTickets[i].day;
                failedTests.style.backgroundColor="#991710";
                failedTests.style.gridColumn=`${7-(this.daysAgo(recentTickets[i].day))}`;
                failedTests.style.gridRowStart="1"
                failedTests.style.gridRowEnd=`${(recentTicketsPassStatus[i].failed.length/failedScale)*100}`;
                negativeDataContainer.appendChild(failedTests);
            }
        }
        
        //adding event listeners
        const graphItems=document.querySelectorAll(".graph-item");
        const graphInfoHoverBox=document.getElementById("infoHoverBox")
        
        graphItems.forEach((graphItem)=>{
            graphItem.addEventListener("mouseenter", (e)=>this.graphInfoHoverBox("enter", graphInfoHoverBox, e))
            graphItem.addEventListener("mouseleave", (e)=>this.graphInfoHoverBox("leave", graphInfoHoverBox, e))
            graphItem.addEventListener("click", (e)=>{
                this.clickOnBarItem(e)
            })
        })

        graphInfoHoverBox.addEventListener("mouseleave", ()=>{
            graphInfoHoverBox.style.display="none"
        })

        //just recent tickets divided by whether they passed or not
        this.recentTickets=recentTicketsPassStatus;
        return;
    }
    

    createFailedTestRunsTimeline(tickets){
        const timeContainer=document.getElementById("timeContainer")
        const positiveDataContainer=document.getElementById("positiveDataContainer")
        const negativeDataContainer=document.getElementById("negativeDataContainer")
        const sortedTickets=this.sortTicketsByDay(tickets)
        
        const now=new Date();


        //------------------------------------Y Axis---------------------------------------------
        this.formatChartData(sortedTickets, positiveDataContainer, negativeDataContainer)
        //------------------------------------X Axis---------------------------------------------
        const weekdays=["Sun", "Mon", "Tues", "Wed", "Thurs", "Fr", "Sat"]
        for(let i=6; i>=0; i--){
            const day=new Date()
            day.setDate(now.getDate()-i)
            const date=document.createElement("span")
            date.textContent=weekdays[day.getDay()];
            date.title=day.toLocaleDateString('en-US')
            date.style.overflow="hidden"
            date.style.textOverflow="elipses"
            date.style.display="inline"
            date.style.textAlign="center"
            timeContainer.appendChild(date);
        }
    }


    getTheTicketRelatedToElement(event){
        let ticketsToDisplay=[]
        const day = new Date(event.target.id);
        const formattedDate = day.toLocaleDateString('en-US')
        console.log(formattedDate)
        if(event.target.classList.contains("passed")){
            for(let i=0; i<this.recentTickets.length; i++){
                for(const ticket of this.recentTickets[i].passed){
                    if(this.daysAgo(ticket.created_at)===this.daysAgo(event.target.id)){
                        ticketsToDisplay.push(ticket);
                    }else{
                        break;
                    }
                }
            }
        }else if(event.target.classList.contains("failed")){
            for(let i=0; i<this.recentTickets.length; i++){
                for(const ticket of this.recentTickets[i].failed){
                    if(this.daysAgo(ticket.created_at)===this.daysAgo(event.target.id)){
                        ticketsToDisplay.push(ticket)
                    }else{
                        break;
                    }
                }
            }
        }
        
        return [ticketsToDisplay, formattedDate];
    }
    
    graphInfoHoverBox(mouse, graphInfoHoverBox, event){
        if(mouse==="enter"){
            const graphHoverBoxTitle=document.getElementById("hover-title");
            const graphHoverBoxContent=document.getElementById("hover-content");
            const [ticketsToDisplay, formattedDate]=this.getTheTicketRelatedToElement(event);
            graphHoverBoxTitle.textContent=`${formattedDate}:`;
            graphHoverBoxContent.textContent=`${event.target.classList.contains("passed") ? "passed" : "failed"}: ${ticketsToDisplay.length}`;
            graphInfoHoverBox.style.top=`${event.pageY}px`;
            graphInfoHoverBox.style.left=`${event.pageX}px`;
            graphInfoHoverBox.style.display="block";
        }else if(mouse === "leave"){
            if(!graphInfoHoverBox.matches(":hover")){
                graphInfoHoverBox.style.display="none";
            }
        }else{
            return;
        }
    }

    clickOnBarItem(event){
        const testRunsContainer=document.querySelector('.test-runs-container');
        const ticketList = document.querySelectorAll(".item-container");
        const uiToolbox=new ManageUiToolbox();
        //in case you have already clicked on a different bar, to see what test runs are there.
        if(ticketList.length>0){
            ticketList.forEach((element)=>{
                element.remove();
            })
        }

        const [ticketsToDisplay]=this.getTheTicketRelatedToElement(event);
        
        uiToolbox.addToList(ticketsToDisplay, testRunsContainer);
    }
}