/**
 * Used by prisma to update relations among tables.
 * - connect: New elements for which a relation shall be created
 * - disconnect: Old elements for which an existing relation shall be deleted
 */
export type RelationUpdate = {
  connect: {
    id: string;
  }[];
  disconnect: {
    id: string;
  }[];
};

/**
 * An element of the database that can be referred by an ID.
 */
export type ReferableItem = {
  id: string;
};

/**
 * Computes the diff of a many-to-many relation and computes which relations shall be new created and which ones shall
 * be removed.
 * Won't compute anything if null or undefined is passed as newData (interpreted as user doesn't want to change this
 * field).
 * @param oldData The existing relations (part of a DAO)
 * @param newData The new elements (part of a DTO)
 * @returns null if nothing shall be changed, or an object that can directly by used by prisma.
 */
export function computeRelationUpdate(oldData: ReferableItem[], newData?: string[] | null) {
  let result: RelationUpdate | undefined = undefined;
  // Change links only for defined properties
  if (newData) {
    const oldItems = oldData.map((c) => c.id);
    const addItems = newData.filter((i) => !oldItems.includes(i));
    const removeItems = oldItems.filter((i) => !newData.includes(i));
    result = {
      connect: addItems.map((i) => ({ id: i })),
      disconnect: removeItems.map((i) => ({ id: i })),
    };
  }
  return result;
}
