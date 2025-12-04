class Ticket{
    constructor(){
        this.getCurrentTicketEssentials().then((results)=>{
            this.ticketId=results[0]
            this.title=results[1];
        })

        this.fetchData=this.fetchData.bind(this);
        this.getTicketsDataByFieldValue=this.getTicketsDataByFieldValue.bind(this);
        this.getRelatedIncidents=this.fetchRelatedIncidents.bind(this);
        this.fetchTestRuns=this.fetchTestRuns.bind(this);
        this.getRelatedRegressions=this.fetchRelatedRegressions.bind(this);

        this.testRuns;
        this.incidents;
        this.regressions;
    }
    async getCurrentTicketEssentials(){
        try{
            const data =await client.get(['ticket.id', 'ticket.subject'])
            return [data['ticket.id'], data['ticket.subject']];
        }catch(error){
            console.error('Error getting ticket ID:', error);
            throw error;
        }
    }


    async fetchData(){
        const response =await client.request(`/api/v2/tickets/${this.ticketId}.json`, 'GET', 'application/json');
        return response.ticket;
    }

    async getTicketsDataByFieldValue(endpoint){
        const settings = {
            url: endpoint,
            type: "GET",
            dataType: "json",
        };
        const matchingTickets = await client.request(settings);
        return matchingTickets;
    }


    //these refresh the various data
    async fetchRelatedIncidents(){
        const response = await this.getTicketsDataByFieldValue(`/api/v2/tickets/${this.ticketId}/incidents.json`);
        this.incidents =response.tickets;
        return this.incidents;
    }
    async fetchTestRuns(){
        const testRunCustomFieldId='40282312288155';
        const response = await this.getTicketsDataByFieldValue(`/api/v2/search.json?query=custom_field_${testRunCustomFieldId}:${this.ticketId}`);
        this.testRuns=response.results;
        return this.testRuns;
    }
    async fetchRelatedRegressions(){
        const relatedRegressionFieldId='39188323306011';
        const response = await this.getTicketsDataByFieldValue(`/api/v2/search.json?query=custom_field_${relatedRegressionFieldId}:${this.ticketId}`);
        this.regressions=response.results;
        return this.regressions;
    }

}