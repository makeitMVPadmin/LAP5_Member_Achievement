import React, { useContext, useState, useEffect } from "react";
import { database } from "./config/firebase";
import { getDocs, collection, Timestamp, doc, updateDoc, increment } from "firebase/firestore";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {

    const [userList, setUserList] = useState([]);

    const usersCollection = collection(database, "Users");

    const getUserList = async () => {
        try {
        const data = await getDocs(usersCollection);
        const filteredUsersData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setUserList(filteredUsersData);
        } catch (error) {
        console.error(error);
        }
    };

    const currentDate = new Date();
      const timeZoneOffsetInMilliseconds = -6 * 60 * 60 * 1000;
      const adjustedDate = new Date(currentDate.getTime() + timeZoneOffsetInMilliseconds);
        adjustedDate.setHours(adjustedDate.getHours() + 6);
      const timestamp = Timestamp.fromDate(adjustedDate);



    useEffect(() => {
        getUserList();
    }, []);

    return (
        <AppContext.Provider
            value={{
                userList, setUserList,
                usersCollection,
                getUserList,
                timestamp
            }}>
                {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppContext, AppProvider };