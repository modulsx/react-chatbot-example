import React from 'react';
import { ConversationalForm } from 'conversational-form';
import './bot-widget.scss';
import { v4 as uuidv4 } from 'uuid';

export default class BotWidget extends React.Component {
  constructor(props) {
    super(props);
    this.formFields = [
      {
        "tag": "fieldset",
        "type": "select",
        "cf-questions": 'Select the type of Ad-hoc Request ?',
        "cf-input-placeholder":"Choose an option",
        "required": "true",
        "children":[
            {
                "tag": "input",
                "type": "radio",
                "name": "requestType",
                "cf-label": "Autosys",
                "value": "Autosys"
            },
            {
                "tag": "input",
                "type": "radio",
                "name": "requestType",
                "cf-label": "Database",
                "value": "Database"
            },
            {
                "tag": "input",
                "type": "radio",
                "name": "requestType",
                "cf-label": "Others",
                "value": "Others"
            }
        ]
      },
      {
        "cf-conditional-requestType":"Others",
        'tag': 'input',
        'type': 'text',
        'name': 'requestType',
        'required': 'true',
        'cf-questions': 'Enter Request Type',
      },
      {
        "cf-conditional-requestType":"Autosys",
        'tag': 'input',
        'type': 'text',
        'name': 'application',
        'required': 'true',
        'cf-questions': 'Choose Autosys Application',
        'list': 'autosys-apps'
      },
      {
        "cf-conditional-requestType":"Database",
        'tag': 'input',
        'type': 'text',
        'name': 'application',
        'required': 'true',
        'cf-questions': 'Choose Database Application',
        'list': 'database-apps'
      },
      {
        "cf-conditional-requestType":"Others",
        'tag': 'input',
        'type': 'text',
        'name': 'application',
        'required': 'true',
        'cf-questions': 'Enter Application Name',
      },
      {
        'tag': 'input',
        'type': 'text',
        'name': 'description',
        'required': 'true',
        'cf-questions': 'Describe Your Issue',
      },
      {
        "tag": "fieldset",
        "cf-questions": "Do you want to upload attachments ?",
        "cf-input-placeholder": " ",
        "children":[
            {
                "tag": "input",
                "type": "radio",
                "name": "isFilesAttached",
                "cf-label": "Yes",
                "value": "True"
            },
            {
                "tag": "input",
                "type": "radio",
                "name": "isFilesAttached",
                "cf-label": "No",
                "value": "False"
            },
        ]
      },
      {
        "cf-conditional-isFilesAttached":"True",
        'tag': 'input',
        'type': 'file',
        'required': 'true',
        'name': 'attachments[]',
        'multiple': 'true',
        'cf-input-placeholder': 'Click the upload button 👉',
        'cf-questions': 'Choose Attachment Files',
        
      },
      {
        'tag': 'cf-robot-message',
        'cf-questions': 'One moment please...',
      }
    ];
    
    this.submitCallback = this.submitCallback.bind(this);
  }
  
  componentDidMount() {
    this.cf = ConversationalForm.startTheConversation({
      options: {
        submitCallback: this.submitCallback,
        flowStepCallback: this.flowStepCallback,
        loadExternalStyleSheet: false,
        preventAutoFocus: true,
      },
      tags: this.formFields,
    });
    this.elem.appendChild(this.cf.el);
  }

  flowStepCallback(dto, success, error) {
    if(dto.tag.type === "file" && dto.tag.required === true){
        if(dto.tag.value !== ""){
            return success();
        }else{
            return error();
        }
    }
    return success();
  }

  getCleanFormData(referenceId) {
    var formDataSerialized = this.cf.getFormData(true);
    var justFormData = this.cf.getFormData();
    var formData = new FormData();

    formData.append('referenceId', referenceId)

    for (var key in formDataSerialized){
      if(key.includes('[]')){
        var files = justFormData.getAll(key)
        for(var i=0; i<files.length; i++){
          formData.append(key, files[i])
        }
      }
      else{
        formData.append(key, formDataSerialized[key])
      }
    }
    return formData
  }
  
  submitCallback() {
    var referenceId = uuidv4()
    var formData = this.getCleanFormData(referenceId)
    var ENDPOINT_URL = 'https://www.formbackend.com/f/8a85bbb7b6c7a66f'
    fetch(ENDPOINT_URL, {
      method: 'POST',
      body: formData,
    }).then(res => {
      if(res.status === 200){
        this.cf.addRobotChatResponse(`Thank You. Our support team will get back to you soon!\nReference Id: ${referenceId}`)
      }
      else{
        this.cf.addRobotChatResponse('Sorry, There was some issue while submitting. Please try again!')
      }
    })
  }
  
  render() {
    return (
      <div>
        <datalist id="autosys-apps">
          <option value="Autosys Application 1"/>
          <option value="Autosys Application 2"/>
          <option value="Autosys Application 3"/>
          <option value="Autosys Application 4"/>
          <option value="Autosys Application 5"/>
        </datalist>
        <datalist id="database-apps">
          <option value="Database Application 1"/>
          <option value="Database Application 2"/>
          <option value="Database Application 3"/>
          <option value="Database Application 4"/>
          <option value="Database Application 5"/>
        </datalist>
        <div
          ref={ref => this.elem = ref}
        />
      </div>
    );
  }
}