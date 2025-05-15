INSERT INTO DBAPDM.TMLDAR (
        I_LDAR,
        I_ID_PGMMODEL,
        N_LDAR_SUBMITBY,
        I_LDAR_PHONE,
        C_LDAR_LSNUNIT,
        A_LDAR_LOC,
        C_LDAR_REFBY,
        I_LDAR_REFBY,
        C_LDAR_VER,
        I_DRAW,
        C_LDAR_IDX,
        E_LDAR_DESIGNATION,
        E_LDAR_REMARK,
        C_LDAR_STAT,
        D_LDAR_STAT,
        I_ENTRY,
        D_ENTRY
    )
VALUES (
        (
            SELECT TO_CHAR(CURRENT_DATE, 'YYMM') || '-LDAR-' || LPAD(
                    (
                        NVL(MAX(TO_NUMBER(SUBSTR(I_LDAR, 11, 4))), 0) + 1
                    ),
                    4,
                    '0'
                ) || '-ELI'
            FROM DBAPDM.TMLDAR
            WHERE TO_CHAR(D_ENTRY, 'YY') = TO_CHAR(CURRENT_DATE, 'YY')
        ),
        :modelId,
        :submittedBy,
        :phone,
        :LSNUnit,
        :location,
        :refCode,
        :refNumber,
        :version,
        :drawingNumber,
        :drawingIndex,
        :drawingDesignation,
        :remark,
        '0',
        CURRENT_DATE,
        :insertUser,
        CURRENT_DATE
    )