import { auth, db } from "./config"
import { GoogleAuthProvider, signInWithPopup, UserCredential, signOut } from "firebase/auth"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"

export async function signInWithGoogleAndHandlePreregistered(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  // Check for pre-registered user
  const preregisteredQuery = query(
    collection(db, "users"),
    where("email", "==", user.email),
    where("isPreregistered", "==", true)
  )
  const preregisteredDocs = await getDocs(preregisteredQuery)

  if (!preregisteredDocs.empty) {
    // Get the pre-registered user data
    const preregisteredDoc = preregisteredDocs.docs[0]
    const preregisteredData = preregisteredDoc.data()

    // Update the existing pre-registered document instead of deleting it
    await updateDoc(doc(db, "users", preregisteredDoc.id), {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      role: preregisteredData.role || 'employee',
      department: preregisteredData.department,
      status: 'active',
      photoURL: user.photoURL,
      lastLogin: new Date(),
      isPreregistered: false, // Mark as no longer pre-registered
      updatedAt: new Date()
    })
  }

  return result
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
} 