// "use client"
// import { createContext, useContext, useState, useEffect } from 'react';


// import { getAuth } from 'firebase/auth';

// import { onAuthStateChanged } from 'firebase/auth';
// import { useRouter } from 'next/navigation.js';

// import { db } from '../../config/firebase';

// const UserContext = createContext();
//   // const auth = getAuth();
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const router = useRouter();
//    const auth = getAuth();
   

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser({ uid: user.uid, displayName: user.displayName });
//       } else {
//         setUser(null);
//         router.push('/auth_signup');
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, router]);

//   return (
//     <UserContext.Provider value={user}>
//       {children}
//     </UserContext.Provider>
//   );
// };


// export const useUser = () => useContext(UserContext);
// "use client";

// import { createContext, useContext, useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { getAuth } from 'firebase/auth'
// import { useRouter } from 'next/navigation';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const router = useRouter();
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser({ uid: user.uid, displayName: user.displayName });
//       } else {
//         setUser(null);
//         router.push('/auth_signup');
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, router]);

//   return (
//     <UserContext.Provider value={user}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

// src/Contexts/UserContexts.js

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../config/firebase.js'; // Import the auth object

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //   if (user) {
      //     setUser({ uid: user.uid, displayName: user.displayName });
      //   } else {
      //     setUser(null);
      //     router.push('/auth_signup');
      //   }
      // });
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

 