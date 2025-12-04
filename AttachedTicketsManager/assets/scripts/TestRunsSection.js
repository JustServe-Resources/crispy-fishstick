class TestRunsSection{
    constructor(){
        this.TestRunsBodyContainer=document.getElementById("testRunsBody")
        this.uiToolbox=new ManageUiToolbox();
    }
    createNewTestRunForm(colorScheme){
        const formContainer=document.createElement("form");
        formContainer.classList.add("create-test-run-form", `${colorScheme==="dark" && "dark"}`);
        formContainer.id="createTestRunForm"
        const formHeader=document.createElement("h3");
        formHeader.textContent="Create New Test Run"



        const testRunTitle=document.createElement("input");
        testRunTitle.type="text";
        testRunTitle.placeholder="Title";
        testRunTitle.name="testRunTitle"
        testRunTitle.classList.add("input", `${colorScheme==="dark" && "dark"}`);


        //create dropdown
        const browserSelector=document.createElement("select");
        browserSelector.classList.add("browser-dropdown", "input", `${colorScheme==="dark" && "dark"}`);
        browserSelector.id="browserInput"
        browserSelector.name="browserInput"
        this.uiToolbox.createDropdownItems(["Chrome", "Firefox", "Edge", "Safari"], browserSelector);
        


        //create checkbox
        const testStatusContainer=document.createElement('div');
        const testStatusHiddenInput=document.createElement('input');
        testStatusHiddenInput.type="hidden";
        testStatusHiddenInput.name="testPassed";
        testStatusHiddenInput.value="Fail"
        testStatusContainer.appendChild(testStatusHiddenInput);
        const testRunCheckbox=document.createElement("input");
        testRunCheckbox.type="checkbox";
        testRunCheckbox.name="testPassed";
        testRunCheckbox.value="Pass"
        testStatusContainer.appendChild(testRunCheckbox);
        const testRunCheckboxLabel=document.createElement("label");
        testRunCheckboxLabel.textContent="Test Passed";
        testRunCheckboxLabel.htmlFor="testPassed"
        testStatusContainer.appendChild(testRunCheckboxLabel);

        //create textarea
        const descriptionLabel=document.createElement("label");
        descriptionLabel.htmlFor="description";
        descriptionLabel.textContent="Comments (optional)";
        const description=document.createElement("textarea");
        description.classList.add("test-run-comments", "input", `${colorScheme==="dark" && "dark"}`);
        description.id="testRunCommentsField";
        description.name="description";
        description.placeholder="Describe your test run";
        description.rows="4";

        //create submit button
        const submitButton=document.createElement("button");
        submitButton.id="submitTestRunBtn";
        submitButton.type="submit";
        submitButton.textContent="Submit new Test Run";
        colorScheme==="dark" && submitButton.classList.add("dark");


        formContainer.appendChild(formHeader);
        formContainer.appendChild(testRunTitle);
        formContainer.appendChild(browserSelector);
        formContainer.appendChild(testStatusContainer);
        formContainer.appendChild(descriptionLabel);
        formContainer.appendChild(description);
        formContainer.appendChild(submitButton);
        this.TestRunsBodyContainer.prepend(formContainer);
        document.getElementById("createTestRunForm").addEventListener('submit', (e)=>{
            e.preventDefault()
            testRunSection.submitNewTestRun(e, ticketData.ticketId)
        });
    }


    async submitNewTestRun(event, ticketId){
        const data=new FormData(event.target);
        const formData=Object.fromEntries(data.entries());
        const subject=formData.testRunTitle || `Test Run - Browser: ${formData.browserInput} - Status: ${formData.testPassed}`;
        const body=formData.description || "Test run completed";
        const tags=[
            "test_run",
        ];
        const ticketData={
            ticket: {
                subject,
                comment: {
                    body 
                },
                custom_fields:[
                    {id: 40282312288155, value: ""+ticketId},
                    {id: 40282490348187, value: ""+formData.testPassed}
                ],
                status: "closed",
                ticket_form_id: 40282271527579,
                tags
            }
        }
        try{
            const response=await client.request({
                url:"/api/v2/tickets.json",
                type:"POST",
                contentType:"application/json",
                data: JSON.stringify(ticketData)
            });
            if(response.ticket){
                //for now we will not be using this since it appears to be too much noise
                this.uiToolbox.addToList([response.ticket], testRunsContainer, "prepend")
            }else{
                throw new Error("Ticket not created recieved: "+response);
            }
        }catch(error){
            console.error("Error creating test run:", error);
        }
    }
}