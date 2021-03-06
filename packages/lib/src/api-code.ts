// SBH-- shouldn't be here

export enum Code {
    Ok = 0,
    Unknown,
    Whocare,
    // 1000 - 1999
    // NOTE: something system error, shouldn't post the Msg to customer

    Pro_Err = 1001,

    Auth_Fail = 1002,

    // 2000 - 2999
    InvalidParam = 2001,
    SyncTimeout = 2002,
    SubqlUnsync = 2003,
}

export enum Msg {
    Ok = 'ok',
    Unknown = 'unknown error',
    Whocare = 'dont care',

    Auth_Fail = 'authority invalid',

    InvalidParam = 'invalid parameters',
    SyncTimeout = 'subquery sync timeout',
    SubqlUnsync = 'subquery has not been synced',
}
