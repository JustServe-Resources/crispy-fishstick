import React, {useState, useEffect} from "react";
import { Combobox, Field as DropdownField, Label as DropdownLabel } from '@zendeskgarden/react-dropdowns';
import Select from 'react-select'

function SetTicketType(editTypeValue, setEditTypeValue){
    const [inputValue, setInputValue]=useState('')
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function fetchTasks(searchTerm){
        const response = window.zafClient.request({
            url: '/api/v2/custom_objects/task/records/search',
            type: 'POST',
            data: {
                query: searchTerm,
                sort_by: 'created_at',
                sort_order: 'desc'
            }
        })
        return response;
    }

    useEffect(() => {
        if (inputValue.length > 2) {
            setIsLoading(true);
            fetchTasks(inputValue).then(results => {
                setOptions(results);
                setIsLoading(false);
            });
        }
    }, [inputValue]);

    return(
        <DropdownField>
            <DropdownLabel>Type</DropdownLabel>
            <Combobox
            inputValue={inputValue}
            onChange={(value) => setEditTypeValue(editTypeValue)}
            isLoading={isLoading}
            selectionValue={editTypeValue}
            onSelect={(value) => {
                if (typeof value === 'string') {
                    setEditTypeValue(value);
                }
            }}
            isEditable={false}
            >
            {/* we need to get search results based on what is entered into the top of the searchbox */}
            {/* then with those results we need to map the top 10 results to the */}
            {
                options.map((option)=>{
                    return <Option key={option.id} value={option.id} label={option.name} />;
                })
            }
            </Combobox>
        </DropdownField>
    )
}

export default SetTicketType;