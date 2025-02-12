INSERT INTO DBAPDM.TMLDARFILE (
        I_ID_LDAR,
        N_LDAR_FILENAME,
        C_LDAR_FILEGRP,
        I_ENTRY,
        D_ENTRY
    )
VALUES (
        :LDARId,
        :name,
        :groups,
        :insertUser,
        CURRENT_DATE
    )