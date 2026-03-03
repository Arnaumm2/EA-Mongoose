import mongoose from "mongoose";
import { IDocument, DocumentModel } from "./documents.js";


function assertValidObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }
}

export async function createDocuent(project: IDocument) {
    try{
        const doc = await DocumentModel.create(project);
        console.log(`Document guardat ${doc}`);
        return doc;
    }catch(err){
        console.log("❌ Error:", err)
    }
}

export async function getDocumentById(id?: string) {
    try{
        if (!id) throw new Error("Missing id");
        assertValidObjectId(id);
        const doc = await DocumentModel.findById(id).populate('organization');
        console.log("Document trobat", id)
        return doc;
    }catch(err){
        console.log("❌ Error:", err);
    }
}

export async function updateDocument(id: string, description: string) {
    try {
        assertValidObjectId(id);
        const doc = await DocumentModel.findByIdAndUpdate(id, { $set: {description} },{ new: true, runValidators: true });
        console.log("Descripció de document actualitzat")
        return doc;
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

export async function deleteDocument(id: string) {
    try{
        assertValidObjectId(id);
        const pro = await DocumentModel.findByIdAndDelete(id);
        console.log("Document eliminat ", id);
        return pro;
    }catch(err){
        console.log("❌ Error:", err)
    }
}

export async function listAllDocuments() {
    try{
        const doc = await DocumentModel.find().lean();
        console.log("Documentació total ", doc.length)
        return doc;
    }catch(err){
        console.log("❌ Error:", err)
    } 
}