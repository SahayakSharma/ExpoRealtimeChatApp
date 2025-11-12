import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { collection, FirebaseFirestoreTypes, getDocs, limit, query, where } from "@react-native-firebase/firestore";
import { UserSearchResult } from "../components/SearchScreen";

const USERS_COLLECTION = "Users";

export async function searchUsersByEmail(
  emailQuery: string
): Promise<UserSearchResult[]> {
  const db = FirebaseAppConfig.getInstance().getDb();

  const usersCollection = collection(db, USERS_COLLECTION);
  const q = query(
    usersCollection,
    where("email", ">=", emailQuery),
    where("email", "<=", emailQuery + "\uf8ff"),
    limit(20)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
    const data = docSnapshot.data();
    return {
      uid: docSnapshot.id,
      name: data.name || "Unknown User",
      email: data.email || "",
      phone_number: data.phone_number,
      profile_picture: data.profile_picture,
    };
  });
}
