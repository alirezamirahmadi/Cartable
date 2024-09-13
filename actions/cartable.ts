"use server";

import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

import receiveModel from "@/models/receive";
import sendModel from "@/models/send";
import connectToDB from "@/utils/db";
import type { CollectionListType } from "@/types/cartableType";

// inbox
async function inboxDocuments(collectionId: string, tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!collectionId || !tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const receives = await receiveModel.aggregate()
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "people", localField: "send.refPerson", foreignField: "_id", as: "sender" })
      .lookup({ from: "collections", localField: "send.refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "roles", localField: "send.refRole", foreignField: "_id", as: "senderRole" })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "recieverRole" })
      .lookup({ from: "urgencies", localField: "refUrgency", foreignField: "_id", as: "urgency" })
      .match({ "person.account.username": tokenPayload.username })
      .match({ "recieverRole.isDefault": true })
      .match({ "send.refCollection": new mongoose.Types.ObjectId(collectionId) })
      .project({
        "sender.firstName": 1, "sender.lastName": 1, "sender.avatar": 1, "senderRole.title": 1, "collection.showTitle": 1, "urgency.title": 1, "send.sendDate": 1,
        "observed": 1, "viewDate": 1, "lastViewedDate": 1, "send.refDocument": 1,
      })
      .unwind("$sender")
      .unwind("$send")
      .unwind("$collection")
      .unwind("$senderRole")
      .unwind("$urgency")

    return JSON.parse(JSON.stringify(receives));
  }
  return [];
}

async function loadInboxCollections(tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const receive = await receiveModel.aggregate()
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "collections", localField: "send.refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .project({ "collection._id": 1, "collection.showTitle": 1 })
      .group({ _id: { "_id": "$collection._id", "showTitle": "$collection.showTitle" } })

    return JSON.parse(JSON.stringify(receive));
  }
  else {
    return [];
  }
}

async function loadNonObserved(tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const receive = await receiveModel.aggregate()
      .match({ observed: false })
      .lookup({ from: "sends", localField: "refSend", foreignField: "_id", as: "send" })
      .lookup({ from: "collections", localField: "send.refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .project({ "collection._id": 1 })
      .group({ _id: { "_id": "$collection._id" }, count: { $sum: 1 } })

    return JSON.parse(JSON.stringify(receive));
  }
  else {
    return [];
  }

}

const handleInboxCollections = (data: any) => {
  const myCollections = new Array<CollectionListType>();

  data && data?.map((collection: any) => {
    myCollections.push({ _id: collection?._id?._id ? collection?._id?._id[0] : "", title: collection?._id?.showTitle ? collection?._id?.showTitle[0] : "", count: 0 });
  })
  return myCollections;
}

const handleNonObserved = (data: any, inboxList: CollectionListType[]) => {
  let count = 0;

  const myCollections = inboxList.map(collection => {
    count = 0;
    data.forEach((observe: any) => { if (observe?._id?._id && observe?._id?._id[0] === collection?._id) count = observe?.count })
    if (count > 0) {
      return { ...collection, count }
    }
    return { ...collection }
  })

  return myCollections;
}

// outbox
async function loadOutboxCollections(tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const sends = await sendModel.aggregate()
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .project({ "collection._id": 1, "collection.showTitle": 1 })
      .group({ _id: { "_id": "$collection._id", "showTitle": "$collection.showTitle" } })

    return JSON.parse(JSON.stringify(sends));
  }
  else {
    return [];
  }
}

async function outboxDocument(collectionId: string, tokenPayload: string | JwtPayload) {
  connectToDB();

  if (!collectionId || !tokenPayload) {
    return [];
  }

  if (typeof tokenPayload !== "string") {
    const sends = await sendModel.aggregate()
      .lookup({ from: "collections", localField: "refCollection", foreignField: "_id", as: "collection" })
      .lookup({ from: "people", localField: "refPerson", foreignField: "_id", as: "person" })
      .match({ "person.account.username": tokenPayload.username })
      .lookup({ from: "roles", localField: "refRole", foreignField: "_id", as: "role" })
      .match({ "role.isDefault": true })
      .match({ "refCollection": new mongoose.Types.ObjectId(collectionId) })
      .project({ "collection.showTitle": 1, "sendDate": 1, "refDocument": 1, "parentReceive": 1 })
      .unwind("$collection")

    return JSON.parse(JSON.stringify(sends));
  }
  return [];
}

async function handleOutboxCollections(data: any) {
  const myCollections = new Array<CollectionListType>();

  data && data?.map((collection: any) => {
    myCollections.push({ _id: collection?._id?._id ? collection?._id?._id[0] : "", title: collection?._id?.showTitle ? collection?._id?.showTitle[0] : "", count: 0 });
  })
  return myCollections;
}


async function inboxCollections(tokenPayload: string | JwtPayload) {
  const collections = handleNonObserved(await loadNonObserved(tokenPayload), handleInboxCollections(await loadInboxCollections(tokenPayload)));
  return collections;
}

async function outboxCollections(tokenPayload: string | JwtPayload) {
  const collections = await handleOutboxCollections(await loadOutboxCollections(tokenPayload));
  return collections;
}

export {
  inboxCollections,
  inboxDocuments,

  outboxCollections,
  outboxDocument,
}