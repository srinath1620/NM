import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { SPFI, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/batching";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/site-groups";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { IItem } from "@pnp/sp/items";
import { choiceGrp, lookupGrp } from "../MarsConstants/Constants";
import { ILookUpColumn, IMarsNew } from "../Interfaces/IMarsForm";

const getSPContext = (context: FormCustomizerContext): SPFI => {
  return spfi().using(SPFx(context));
};

// export const getItem = async (
//   context: FormCustomizerContext,
//   id: number
// ): Promise<IItem> => {
//   const spCtx = getSPContext(context);
//   const item: IItem = await spCtx.web.lists
//     .getByTitle("MarsRequests")
//     .items.getById(id)
//     .select(
//       "*",
//       "DistributionCenter/Title",
//       "DCWorkCompletedBy/Title",
//       "Author/EMail",
//       "MerchPrimaryApprover/EMail",
//       "MerchSecondaryApprover/EMail"
//     )
//     .expand(
//       "DistributionCenter",
//       "DCWorkCompletedBy",
//       "Author",
//       "MerchPrimaryApprover",
//       "MerchSecondaryApprover"
//     )();
//   console.log(`Item - `, item);
//   return item;
// };

// export const getUser = async (
//   context: FormCustomizerContext,
//   id: number
// ): Promise<IItem> => {
//   const spCtx = getSPContext(context);
//   const item: any = await spCtx.web.getUserById(id)();
//   console.log(`Item - `, item);
//   return item;
// };

/*
Updated one below
export const getListColumns = async (
  context: FormCustomizerContext,
  listName: string
) => {
  const reqData: {
    [key: string]: { key: string; text: string; dependentVal?: string }[];
  } = {};
  try {
    const sp = getSPContext(context);
    lookupGrp.forEach(async (lkup) => {
      const look = await sp.web.lists
        .getByTitle(lkup.value)
        .items.select("Id", "Title", "Division")();
      if (look) {
        reqData[lkup.key] = look.map((lup) => ({
          key: lup.Id,
          text: lup.Title,
          dependentVal: lup.Division,
        }));
      }
      console.log(
        `Lookup Options for ${lkup.key}:`,
        look.map((lup) => ({
          key: lup.Id,
          text: lup.Title,
        }))
      );
    });
    const mylist = await sp.web.lists
      .getByTitle(listName)
      .select("Fields")
      .expand("Fields");

    const myfields: any = await mylist.fields();
    choiceGrp.forEach((chgrp) => {
      const grpItem = myfields
        .find((item: { InternalName: string }) => chgrp === item.InternalName)
        ?.Choices?.map((item: any) => ({
          key: item,
          text: item,
          disabled: false,
        }));
      if (grpItem) {
        reqData[chgrp] = grpItem;
      }
    });

    console.log(` all fields - `, reqData);
    return reqData;
  } catch (error) {
    console.error("Error fetching list columns:", error);
  }
};
*/

// export const addItem = async (context: FormCustomizerContext, item: {}) => {
//   const spCtx = getSPContext(context);
//   const newItem = await spCtx.web.lists
//     .getByTitle("MarsRequests")
//     .items.add(item);
//   console.log(newItem);
//   return newItem;
// };

// export const updateItem = async (
//   context: FormCustomizerContext,
//   ID: number,
//   item: {}
// ) => {
//   const spCtx = getSPContext(context);
//   const list = spCtx.web.lists.getByTitle("MarsRequests");
//   const upItem = await list.items.getById(ID).update(item);
//   console.log(upItem);
//   return upItem;
// };

// export const getSPGroupUsers = async (
//   context: FormCustomizerContext,
//   groupName: string
// ) => {
//   // get all users of group
//   const spCtx = getSPContext(context);
//   let users: any = [];
//   try {
//     users = await spCtx.web.siteGroups.getByName(groupName).users();
//   } catch (err) {
//     console.log("Unable to get users from SP Group:", err);
//   }
//   return users;
// };

// // Function to get current user's SharePoint groups
// export const getCurrentUserGroups = async (context: FormCustomizerContext) => {
//   const spCtx = getSPContext(context);
//   try {
//     // Get the current logged-in user
//     const currentUserGrps = await spCtx.web.currentUser.groups();
//     // const userGrps = currentUserGrps?.filter((grp) => {
//     //   return userApprGroups.indexOf(grp?.Title?.toLocaleLowerCase()) > -1;
//     // });
//     console.log("User Groups:", currentUserGrps);
//     return currentUserGrps;
//   } catch (error) {
//     console.error("Error fetching user groups:", error);
//   }
// };

// export const getUniqueItems = async (
//   context: FormCustomizerContext,
//   uniqueID: string
// ): Promise<IItem> => {
//   const spCtx = getSPContext(context);
//   const items: IItem = await spCtx.web.lists
//     .getByTitle("MarsRequests")
//     .items.select("ID", "MarsUniqueID")
//     .filter(`MarsUniqueID eq '${uniqueID}'`)();
//   return items;
// };

// export const updateMultipleItems = async (
//   context: FormCustomizerContext,
//   itemIDs: any,
//   item: any
// ) => {
//   const spCtx = getSPContext(context);
//   const [batchedSP, execute] = spCtx.batched();

//   const res: any = [];
//   for (let k = 0; k < itemIDs.length; k += 1) {
//     batchedSP.web.lists
//       .getByTitle("MarsRequests")
//       .items.getById(itemIDs[k])
//       .update(item)
//       .then((response) => res.push(response))
//       .catch((error) => console.error(error));
//   } // Executes the batched calls
//   try {
//     await execute();
//     return res;
//   } catch (batchError) {
//     console.error("Batch execution failed:", batchError);
//   }
// };

// export const addMultipleItems = async (
//   context: FormCustomizerContext,
//   items: any
// ) => {
//   const spCtx = getSPContext(context);
//   const [batchedSP, execute] = spCtx.batched();

//   const res: any = [];
//   for (let k = 0; k < items.length; k += 1) {
//     batchedSP.web.lists
//       .getByTitle("MarsRequests")
//       .items.add(items[k])
//       .then((response) => res.push(response))
//       .catch((error) => console.error(error));
//   } // Executes the batched calls
//   try {
//     await execute();
//     return res;
//   } catch (batchError) {
//     console.error("Batch execution failed:", batchError);
//   }
// };

export const getCurrentUserGroups = async (
  context: FormCustomizerContext
): Promise<any> => {
  const spCtx = getSPContext(context);
  try {
    // Get the current logged-in user
    const currentUserGrps = await spCtx.web.currentUser.groups();
    return currentUserGrps.map((grp) => grp.Title);
  } catch (error) {
    console.error("Error fetching user groups:", error);
  }
};

export const getListColumns = async (
  context: FormCustomizerContext,
  listName: string
): Promise<{ [key: string]: ILookUpColumn[] }> => {
  const reqData: { [key: string]: ILookUpColumn[] } = {};

  try {
    const sp = getSPContext(context);

    for (const lkup of lookupGrp) {
      const look = await sp.web.lists
        .getByTitle(lkup.value)
        .items.select("Id", "Title", "Division", "Order0")();

      if (look) {
        reqData[lkup.key] = look.map((lup) => ({
          key: lup.Id.toString(),
          text: lup.Title,
          dependentVal: lup.Division,
          order: lup.Order0,
        }));
      }

      console.log(
        `Lookup Options for ${lkup.key}:`,
        look.map((lup) => ({
          key: lup.Id.toString(),
          text: lup.Title,
        }))
      );
    }

    const mylist = await sp.web.lists
      .getByTitle(listName)
      .select("Fields")
      .expand("Fields");

    const myFields: any = await mylist.fields();

    choiceGrp.forEach((chgrp: string) => {
      // Ensure that `chgrp` matches the `InternalName` type in the `myFields` array
      const grpItem = myFields
        .find((item: any) => chgrp === item?.InternalName)
        ?.Choices?.map(
          (item: { key: string; text: string; disabled: boolean }) => ({
            key: item,
            text: item,
            disabled: chgrp === "MerchLocation" ? true : false,
          })
        );

      if (grpItem) {
        reqData[chgrp] = grpItem;
      }
    });

    console.log(`All fields - `, reqData);
    return reqData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching list columns:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

export const addItem = async (
  context: FormCustomizerContext,
  item: IMarsNew
): Promise<any> => {
  try {
    const spCtx: SPFI = getSPContext(context);
    const newItem = await spCtx.web.lists
      .getByTitle("MarsRequests")
      .items.add(item);
    return newItem;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

export const getItem = async (
  context: FormCustomizerContext,
  id: number
): Promise<IItem> => {
  const spCtx = getSPContext(context);
  const item: IItem = await spCtx.web.lists
    .getByTitle("MarsRequests")
    .items.getById(id)
    .select(
      "*",
      "DistributionCenter/Title",
      "DCWorkCompletedBy/Title",
      "Author/EMail",
      "MerchPrimaryApprover/EMail",
      "MerchSecondaryApprover/EMail"
    )
    .expand(
      "DistributionCenter",
      "DCWorkCompletedBy",
      "Author",
      "MerchPrimaryApprover",
      "MerchSecondaryApprover"
    )();
  console.log(`Item - `, item);
  return item;
};

export const updateItem = async (
  context: FormCustomizerContext,
  ID: number,
  item: {}
): Promise<any> => {
  const spCtx = getSPContext(context);
  const list = spCtx.web.lists.getByTitle("MarsRequests");
  const upItem = await list.items.getById(ID).update(item);
  console.log(upItem);
  return upItem;
};

export const addMultipleItems = async (
  context: FormCustomizerContext,
  items: any
): Promise<any> => {
  const spCtx = getSPContext(context);
  const [batchedSP, execute] = spCtx.batched();

  const res: any = [];
  for (let k = 0; k < items.length; k += 1) {
    batchedSP.web.lists
      .getByTitle("MarsRequests")
      .items.add(items[k])
      .then((response) => res.push(response))
      .catch((error) => console.error(error));
  } // Executes the batched calls
  try {
    await execute();
    return res;
  } catch (batchError) {
    console.error("Batch execution failed:", batchError);
  }
};
