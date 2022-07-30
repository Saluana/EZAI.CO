import state from "./state";
import ezapi from "./ezapi";
import {Storage} from "@capacitor/storage";
const {user, docToEdit} = state
const {editDocument} = ezapi


async function addNotesToDoc(selectedDocument: any): Promise<void> {
    const currentDoc =
      user.value.documents[selectedDocument.value.folderId][
        selectedDocument.value.index
      ];

    function makeNotes(noteText: string): string {
      return `<p>• ${noteText}</p>`;
    }

    const notesToAppend = selectedDocument.value.content.map(makeNotes);
    const updatedNotes = currentDoc.content + notesToAppend.join("");

    try {
      await editDocument(
        selectedDocument.value._id,
        selectedDocument.value.title,
        updatedNotes
      );
    } catch (e) {
      console.log(e);
      return
    }

    user.value.documents[selectedDocument.value.folderId][
      selectedDocument.value.index
    ].content = updatedNotes;

    await Storage.set({
      key: "userData",
      value: JSON.stringify(user.value),
    });

    docToEdit.value._id = selectedDocument.value._id;
    docToEdit.value.title = selectedDocument.value.title;
    docToEdit.value.content = updatedNotes;
    docToEdit.value.folderId = selectedDocument.value.folderId;
    docToEdit.value.index = selectedDocument.value.index;

    return
  }

  async function addSummaryToDoc(selectedDocument: any, articleData: any): Promise<void> {
    const currentDoc =
      user.value.documents[selectedDocument.value.folderId][
        selectedDocument.value.index
      ];

    function makeSummary(summary: string): string {
      return `<p>${summary}</p>`;
    }

    const summaryToAppend = makeSummary(articleData.value.summary as string);
    const updatedNotes = currentDoc.content + summaryToAppend;

    try {
      await editDocument(
        selectedDocument.value._id,
        selectedDocument.value.title,
        updatedNotes
      );
    } catch (e) {
      console.log(e);
      return
    }

    user.value.documents[selectedDocument.value.folderId][
      selectedDocument.value.index
    ].content = updatedNotes;

    await Storage.set({
      key: "userData",
      value: JSON.stringify(user.value),
    });

    docToEdit.value._id = selectedDocument.value._id;
    docToEdit.value.title = selectedDocument.value.title;
    docToEdit.value.content = updatedNotes;
    docToEdit.value.folderId = selectedDocument.value.folderId;
    docToEdit.value.index = selectedDocument.value.index;

    return
  }

  export default {addNotesToDoc, addSummaryToDoc}