INSERT INTO DBAPDM.TMLDARAPRV (
        I_ID_LDAR,
        I_ID_LDARAPRVTYPE,
        I_LDAR_APRV,
        I_ENTRY,
        D_ENTRY
    )
VALUES (
        :LDARId,
        0,
        :nik,
        :insertUser,
        CURRENT_DATE
    )