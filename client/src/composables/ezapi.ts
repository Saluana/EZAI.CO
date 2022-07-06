import {Http} from "@capacitor-community/http"
import firebase from '../firebase/firebase';
const {getIdToken} = firebase
const imageServerUrl = "http://localhost:8081"
const scraperServerUrl = "http://localhost:8082"
const userServerUrl = "http://localhost:8080"


/* Scanned Photo API */

//Correct grammar of scanned image
async function correctGrammar(text: string): Promise<string | null>{
    const idToken = await getIdToken();
    const options = {
        url: `${imageServerUrl}/image/correct`,
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
async function createNotes(text: string): Promise<string[] | null>{
const idToken = await getIdToken();
const options = {
    url: `${imageServerUrl}/image/notes`,
    headers: {
        authorization: idToken,
        'Content-Type': 'application/json'
}, data: {text}
}
const response: any = await Http.post(options);

if (response.data.status === "success") { 
    console.log("Notes response", response)
    return response.data.notes;
} else {
    console.log("Notes failure", null)
    return null;
}
}

//Summarize text from scanned image
async function summarizeText(text: string): Promise<string | null>{
    const idToken = await getIdToken();
    const options = {
        url: `${imageServerUrl}/image/summarize`,
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
interface article {
    title: string,
    summary?: string,
    notes?: string[],
}

async function getUrlSummary (url: string): Promise<article | null> {
const idToken = await getIdToken();
const options = {
    url: `${scraperServerUrl}/url/summary`,
    headers: {
        authorization: idToken,
        'Content-Type': 'application/json',
},
data: {URI: url}
}
try{
// eslint-disable-next-line
var response: any = await Http.post(options);
} catch {
    console.log("url summary failure", null)
    return null;
}

if (response) { 
    console.log("summary response", response)
    return {summary: response.data.summary, title: response.data.title}
} else {
    return null
}
}

async function getUrlNotes (url: string): Promise<article | null> {
    const idToken = await getIdToken();
    const options = {
        url: `${scraperServerUrl}/url/notes`,
        headers: {
            authorization: idToken,
            'Content-Type': 'application/json',
    },
    data: {URI: url}
    }
    try{
    // eslint-disable-next-line
    var response: any = await Http.post(options);
    } catch {
        console.log("url notes failure", null)
        return null;
    }
    
    if (response) { 
        return {notes: response.data.notes, title: response.data.title}
    } else {
        return null
    }
    }

    async function scanImage(imageBlob: any) {
        let data:string | null = null;

        if (imageBlob) {
          const idToken = await getIdToken();
           
          const formData = new FormData();
          formData.append('file', imageBlob);

          const response = await fetch(`${imageServerUrl}/image/scan`, {
            method: "POST",
            headers: {
                authorization: idToken
            },
            body: formData
          })

          const responseData = await response.json();

            if (responseData.text) {
                data = responseData.text;
                return data
            } else {
                return null
            }
          
        }

    }

    /* DOCUMENTS AND FOLDERS */
    //Get all folders
    async function getFolders (): Promise<any> {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/get-folders`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }
        }
        const response: any = await Http.get(options);
        if (response.data.status === "success") { 
            console.log("folders response", response)
            return response.data.folders;
        } else {
            console.log("folders failure", null)
            return null;
        }
    }

    //Create a new folder
    async function createFolder (title: string): Promise<any> {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/new-folder`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }, data: {title}
        }
        const response: any = await Http.post(options);

        if (response.data.status === "success") { 
            console.log("folder response", response)
            return response.data
        } else {
            console.log("folder failure", null)
            return null;
        }
    }

    //Delete a folder
    async function deleteFolder (uid: string) {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/remove-folder`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }, data: {folderId: uid}
        }
        const response: any = await Http.post(options);

        if (response.data.status === "success") { 
            console.log("folder response", response)
            return response.data
        } else {
            console.log("folder failure", null)
            return null;
        }
    }

    //Edit a folder
    async function editFolder (folderId: string, title: string) {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/update-folder`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }, data: {folderId: folderId, title: title}
        }
        const response: any = await Http.put(options);

        if (response.data.status === "success") { 
            console.log("folder response", response)
            return response.data
        } else {
            console.log("folder failure", null)
            return null;
        }
    }

    /* DOCUMENTS */ 
    //Get all documents
    async function getDocuments (folderId: string|string[]): Promise<any> {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/get-files?folderId=${folderId}`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }
        }
        const response: any = await Http.get(options);
        if (response.data.status === "success") {
            console.log("documents response", response)
            return response.data.files;
        } else {
            console.log("documents failure", null)
            return null;
        }
    }

    //Create a new document
    async function createDocument (title: string, folderId: string|string[], content: string): Promise<any> {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/new-file`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }, data: {title: title, folderId: folderId, content: content}
        }
        const response: any = await Http.post(options);

        if (response.data.status === "success") { 
            console.log("document response", response)
            return response.data
        } else {
            console.log("document failure", null)
            return null;
        }
    }

    //Delete a document
    async function deleteDocument (fileId: string) {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/remove-file`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }, data: {fileId: fileId}
        }
        const response: any = await Http.post(options);

        if (response.data.status === "success") { 
            console.log("document response", response)
            return response.data
        } else {
            console.log("document failure", null)
            return null;
        }
    }

    //Edit a document
    async function editDocument (fileId: string, title: string, content: string) {
        const idToken = await getIdToken();
        const options = {
            url: `${userServerUrl}/docs/update-file`,
            headers: {
                authorization: idToken,
                'Content-Type': 'application/json'
        }, data: {fileId: fileId, title: title, content: content}
        }
        const response: any = await Http.put(options);
        
        if (response.data.status === "success") {
            console.log("document response", response)
            return response.data
        } else {
            console.log("document failure", null)
            return null;
        }
    }

export default {correctGrammar, createNotes, summarizeText, getUrlSummary, getUrlNotes, scanImage, getFolders, createFolder, deleteFolder, editFolder, getDocuments, createDocument, deleteDocument, editDocument}


