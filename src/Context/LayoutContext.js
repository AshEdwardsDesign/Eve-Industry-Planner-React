import React, { createContext, useState } from 'react';

export const DataExchangeContext = createContext();

export const DataExchange = (props) => {
    const [DataExchange, updateDataExchange] = useState(false);

    return (
        <DataExchangeContext.Provider value={{ DataExchange, updateDataExchange }}>
            {props.children}
        </DataExchangeContext.Provider>
    );
};

export const SnackBarDataContext = createContext();

export const SnackbarData = (props) => {
    const [snackbarData, setSnackbarData] = useState({
        anchorOrigin:{ vertical: "bottom", horizontal: "center" },
        autoHideDuration: 3000,
        direction: "up",
        key: Date.now(),
        message: "",
        open: false,
        severity: "",
        variant:"filled",
    });

    return (
        <SnackBarDataContext.Provider value={{ snackbarData, setSnackbarData }}>
            {props.children}
        </SnackBarDataContext.Provider>
    );
};

export const DialogDataContext = createContext();

export const DialogData = (props) => {
    const [dialogData, updateDialogData] = useState({
        buttontext:"",
        id: "",
        open: false,
        title: "",
        body: ""
    });

    return (
        <DialogDataContext.Provider value={{ dialogData, updateDialogData }}>
            {props.children}
        </DialogDataContext.Provider>
    );
};

export const PageLoadContext = createContext();

export const PageLoad = (props) => {
    const [pageLoad, updatePageLoad] = useState(true);

    return (
        <PageLoadContext.Provider value={{ pageLoad, updatePageLoad }}>
            {props.children}
        </PageLoadContext.Provider>
    );
};

export const LoadingTextContext = createContext();

export const LoadingText = (props) => {
    const [loadingText, updateLoadingText] = useState("");

    return (
        <LoadingTextContext.Provider value={{ loadingText, updateLoadingText }}>
            {props.children}
        </LoadingTextContext.Provider>
    );
};
