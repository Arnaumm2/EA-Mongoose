import mongoose from 'mongoose';
import { DocumentModel, IDocument } from './documents.js';
import { OrganizationModel, IOrganization } from './organization.js';
import { createDocuent, deleteDocument, getDocumentById, listAllDocuments, updateDocument } from './dbLayer.js';

async function runDemo() {
  try {
    // --- 1. CONNECTION ---
    await mongoose.connect('mongodb://127.0.0.1:27017/ea_mongoose');
    console.log('🚀 Connected to MongoDB');

    // --- 2. CLEANING (Idempotency) ---
    // Engineering Rule: Tests/Demos must be repeatable.
    console.log('🧹 Cleaning database...');
    await DocumentModel.deleteMany({});
    await OrganizationModel.deleteMany({});

    // --- 3. SEEDING (The missing part) ---
    console.log('🌱 Seeding data...');

    // 3.1 Create Organizations first
    const orgs = await OrganizationModel.insertMany([
      { name: 'Initech', country: 'USA' },
      { name: 'Umbrella Corp', country: 'UK' }
    ]);
    
    // We map existing IDs to link them dynamically
    const initechId = orgs[0]._id;
    const umbrellaId = orgs[1]._id;

    // 3.2 Create Users linked to Orgs
    // Manual referencial integrity: We use the actual _id from the created organizations to ensure valid references.
    const documentData = [
      { name: 'ISO_14001', description: 'Projecte de ISO_14001 ambiental' , organization: initechId },
      { name: 'Permís de instal·lació maquina vapor', description: 'Document relacionat amb el projecte del permís de la instal·lació', organization: initechId }
    ];

    const documents = await DocumentModel.insertMany(documentData);
    console.log(`✅ Seeded ${documentData.length} users and ${orgs.length} organizations`);

    // --- 4.1 DEMO: CRUD OPERATIONS ---
    console.log('\n🔧 CRUD DEMO:');
    //CREATE
    const doc: IDocument = {
      name: "Procés ambiental",
      description: "Projecte nou",
      organization: initechId
    };
    const createDoc = await createDocuent(doc);
    if (!createDoc) throw new Error("No s'ha pogut crear el document");
    const createdId = createDoc._id?.toString();
    //GET DOCU
    const getIdDoc = await getDocumentById(createdId);
    console.log(getIdDoc);

    //UPDATE DOCUMENT
    const updatedDoc: Partial<IDocument> = {
      description: "bones"
    };
    if (!updatedDoc.description) throw new Error("Falta description per actualitzar");
    const upDoc = await updateDocument(createdId, updatedDoc.description);

    //DELETE BY ID
    const deletDoc = await deleteDocument(createdId);
    console.log("Eliminant document ", createdId);

    //MOSTRAR TOTS DOCUMENTS

    const listAllDocs = await listAllDocuments();
    console.log(listAllDocs);


  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected');
  }
}

runDemo();

