import React, { useState } from 'react';

const MyContext = React.createContext();

const MyContextProvider = ({children}) => {

    const [globalUsername, setGlobalUsername] = useState('');
    
    //const [globalExptype, setGlobalExptype] = useState(null); 
    
    let objValue = {
        key_username: [globalUsername, setGlobalUsername]
    };

    return (
        <MyContext.Provider value={ objValue }>
            {children}
        </MyContext.Provider>
    );
};

export { MyContext, MyContextProvider }