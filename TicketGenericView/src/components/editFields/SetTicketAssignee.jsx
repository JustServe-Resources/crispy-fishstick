import React from "react";
import { Field, Label, Input } from '@zendeskgarden/react-forms';

function SetTicketAssignee(){
    return(
        <Field>
            <Label>Assignee</Label>
            <Input
                value={editAssigneeValue}
                onChange={(e) => setEditAssigneeValue(e.target.value)}
            />
        </Field>
    )
}

export default SetTicketAssignee;