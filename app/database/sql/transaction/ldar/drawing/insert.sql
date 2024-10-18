INSERT INTO DBAPDM.TMLDARDRAW (
        I_ID_LDAR,
        I_DRAWING_SHEET,
	I_LDAR_DRAWDISPO,
	I_LDAR_ADCNDCN,
	I_LDAR_DRAWSHEET,
	I_ENTRY,
	D_ENTRY
    )
VALUES (
        :LDARId,
        :idDrawingSheet,
        :drawingNumber,
        :adcn,
        :drawingSheet,
        :insertUser,
        CURRENT_DATE
    )