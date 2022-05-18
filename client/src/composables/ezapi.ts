import {Http} from "@capacitor-community/http"
import firebase from '../firebase/firebase';
const {getIdToken} = firebase

/* Scanned Photo API */

//Correct grammar of scanned image
async function correctGrammar(text: string): Promise<string | null>{
    const idToken = await getIdToken();
    const options = {
        url: 'https://server.ezai.co/image/correct',
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

//Create a list of notes from scanned image
async function createNotes(text: string): Promise<string | null>{
const idToken = await getIdToken();
const options = {
    url: 'https://server.ezai.co/image/notes',
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

//Summarize text from scanned image
async function summarizeText(text: string): Promise<string | null>{
    const idToken = await getIdToken();
    const options = {
        url: 'https://server.ezai.co/image/summarize',
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

/* URL SCRAPER API */
async function getUrlSummary (url: string): Promise<string | null> {
const idToken = await getIdToken();
const options = {
    url: `https://server.ezai.co/url/summary?uri=${url}`,
    headers: {
        authorization: idToken,
        'Content-Type': 'application/json'
}
}
try{
// eslint-disable-next-line
var response: any = await Http.get(options);
} catch {
    console.log("url summary failure", null)
    return null;
}

if (response) { 
    console.log("summary response", response)
    return response.data.summary
} else {
    return null
}
}

async function getUrlNotes (url: string): Promise<string[] | null> {
    const idToken = await getIdToken();
    const options = {
        url: `https://server.ezai.co/url/notes?uri=${url}`,
        headers: {
            authorization: idToken,
            'Content-Type': 'application/json'
    }
    }
    try{
    // eslint-disable-next-line
    var response: any = await Http.get(options);
    } catch {
        console.log("url notes failure", null)
        return null;
    }
    
    if (response) { 
        console.log("Notes response", response)
        return response.data.notes
    } else {
        return null
    }
    }

export default {correctGrammar, createNotes, summarizeText, getUrlSummary, getUrlNotes}


