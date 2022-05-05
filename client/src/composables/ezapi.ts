import {Http} from "@capacitor-community/http"
import firebase from '../firebase/firebase';
const {getIdToken} = firebase

//Correct grammar
async function correctGrammar(text: string): Promise<string | null>{
    const idToken = await getIdToken();
    const options = {
        url: 'http://192.168.100.142:3000/image/correct',
        headers: {
            authorization: idToken,
            'Content-Type': 'application/json'
    }, data: {text}
}
const response: any = await Http.post(options);

if (response.data.status === "success") { 
    console.log("grammar response", response)
    return response.data.response;
} else {
    console.log("Grammar failure", null)
    return null;
}
} 

//Create a list of notes
async function createNotes(text: string): Promise<string | null>{
const idToken = await getIdToken();
const options = {
    url: 'http://192.168.100.142:3000/image/notes',
    headers: {
        authorization: idToken,
        'Content-Type': 'application/json'
}, data: {text}
}
const response: any = await Http.post(options);

if (response.data.status === "success") { 
    console.log("Notes response", response)
    return response.data.response;
} else {
    console.log("Notes failure", null)
    return null;
}
}

async function summarizeText(text: string): Promise<string | null>{
    const idToken = await getIdToken();
    const options = {
        url: 'http://192.168.100.142:3000/image/summarize',
        headers: {
            authorization: idToken,
            'Content-Type': 'application/json'
    }, data: {text}
}
const response: any = await Http.post(options);

if (response.data.status === "success") { 
    console.log("summary response", response)
    return response.data.response;
} else {
    console.log("summary failure", null)
    return null;
}
} 

export default {correctGrammar, createNotes, summarizeText}


