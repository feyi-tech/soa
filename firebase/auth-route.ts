import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPhoneNumber,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser,
    sendEmailVerification,
    sendPasswordResetEmail,
    verifyPasswordResetCode,

    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    ProviderId,
    signInWithPopup,
    Auth, User, UserCredential, ApplicationVerifier, OAuthProvider, AuthProvider, 
    fetchSignInMethodsForEmail, linkWithCredential, AuthCredential,
    reauthenticateWithCredential
} from "firebase/auth";

const getProviderById = (id: string) => {
    switch (id) {
        case ProviderId.FACEBOOK:
            //provider.addScope('user_birthday')
            return new FacebookAuthProvider()
        case ProviderId.GOOGLE:
            return new GoogleAuthProvider()
        case ProviderId.TWITTER:
            return new TwitterAuthProvider()
        default:
            return null
    }
}
const providerSignIn = (auth: Auth, provider: AuthProvider, onGetUserPass: () => string) => {
    return new Promise((resolve, reject) => {
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            resolve(result)
        }).catch((error) => {
            handleAuthError(resolve, reject, auth, error, onGetUserPass)
        })
    })
}

const handleAuthError = (resolve, reject, auth, error, onGetUserPass) => {
    // Handle Errors here.
    if (
        error.code === 'auth/account-exists-with-different-credential' || 
        error.code === 'auth/email-already-in-use'
    ) {
        // Step 2.
        // User's email already exists.
        // The pending Google credential.
        var pendingCred: AuthCredential = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get sign-in methods for this email.
        fetchSignInMethodsForEmail(auth, email)
        .then( (methods) => {
            // Step 3.
            // If the user has several sign-in methods,
            // the first method in the list will be the "recommended" method to use.
            if (methods[0] === 'password') {
                // Asks the user their password.
                // In real scenario, you should handle this asynchronously.
                if(onGetUserPass) {
                    var password = onGetUserPass(); // TODO: implement getUserPassPrompt.
                    signInWithEmailAndPassword(auth, email, password)
                    .then( (result) => {
                        // Step 4a.
                        return linkWithCredential(result.user, pendingCred);
                    }).then( (result) => {
                        // Google account successfully linked to the existing Firebase user.
                        //goToApp();
                        resolve(result)
                    })
                    .catch(error => {
                        reject(error)
                    })

                } else {
                    //This means the user tried to sign up/in with password with a password created account
                    reject(error)
                }

            } else {
                // All the other cases are external providers.
                // Construct provider object for that provider.
                // TODO: implement getProviderForProviderId.
                var provider = getProviderById(methods[0]);
                // At this point, you should let the user know that they already have an account
                // but with a different provider, and let them validate the fact they want to
                // sign in with this provider.
                // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                // so in real scenario you should ask the user to click on a "continue" button
                // that will trigger the signInWithPopup.
                signInWithPopup(auth, provider)
                .then( (result) => {
                    // Remember that the user may have signed in with an account that has a different email
                    // address than the first one. This can happen as Firebase doesn't control the provider's
                    // sign in flow and the user is free to login using whichever account they own.
                    // Step 4b.
                    // Link to Google credential.
                    // As we have access to the pending credential, we can directly call the link method.
                    //result.user.linkAndRetrieveDataWithCredential(pendingCred)
                    return linkWithCredential(result.user, pendingCred)
                })
                .then( (usercred) => {
                    // Google account successfully linked to the existing Firebase user.
                    //goToApp();
                    resolve(usercred)
                })
                .catch(error => {
                    reject(error)
                })
            }
        })
        .catch(error => {
            reject(error)
        })
    } else {
        reject(error)
    }
}
export default function authSetup(service: Auth) {
    
    return {
        service: service,
        emailPassUp: (email: string, password: string) => {
            return createUserWithEmailAndPassword(service, email, password)
        },
        emailPassIn: (email: string, password: string) => {
            return signInWithEmailAndPassword(service, email, password)
        },
        phoneIn: (phoneNumber: string, appVerifier: ApplicationVerifier) => {
            return signInWithPhoneNumber(service, phoneNumber, appVerifier)
            /*
            .then((confirmationResult) => {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
              // ...
            }).catch((error) => {
              // Error; SMS not sent
              // ...
            })*/
        },
        updateProfile: (data: User) => {
            return updateProfile(service.currentUser, data)
            /*
            .then(() => {
                // Profile updated!
                // ...
            }).catch((error) => {
                // An error occurred
                // ...
            })*/
        },
        changeEmail: (email: string) => {
            return updateEmail(service.currentUser, email)
        },
        changePassword: (newPassword: string) => {
            return updatePassword(service.currentUser, newPassword)
        },
        deleteAccount: () => {
            return deleteUser(service.currentUser)
        },
        verifyEmail: (returnTo: string) => {
            return sendEmailVerification(service.currentUser, returnTo? {url: returnTo} : null)
            /*
            .then(() => {
              // Email verification sent!
              // ...
            })*/
        },
        sendPassResetMail: (email: string, returnTo: string) => {
            return sendPasswordResetEmail(service, email, returnTo? {url: returnTo} : null)
        },
        verifyPassResetCode: (code: string) => {
            return verifyPasswordResetCode(service, code)
        },
        signOut: () => {
            return service.signOut()
            /*
            .then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            })*/
        },

        googleSignIn: (onGetUserPass: () => string) => {
            const provider = getProviderById(ProviderId.GOOGLE) // setup provider here
            return providerSignIn(service, provider, onGetUserPass)
        },
        facebookSignIn: (onGetUserPass: () => string) => {
            const provider = getProviderById(ProviderId.FACEBOOK) // setup provider here
            return providerSignIn(service, provider, onGetUserPass)
        },
        twitterSignIn: (onGetUserPass: () => string) => {
            const provider = getProviderById(ProviderId.TWITTER) // setup provider here
            return providerSignIn(service, provider, onGetUserPass)
        }
    }
}