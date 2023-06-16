UPDATE DBAPDM.TMLDAR
SET C_PGM_MODEL = :modelCode,
	I_LDAR_PHONE = :phone,
	C_LDAR_LSNUNIT = :LSNUnit,
	A_LDAR_LOC = :location,
	C_LDAR_REFBY = :refCode,
	I_LDAR_REFBY = :refNumber,
	C_LDAR_VER = :version,
	I_DRAW = :drawingNumber,
	C_LDAR_IDX = :drawingIndex,
	E_LDAR_DESIGNATION = :drawingDesignation,
	Q_LDAR_MANHOUR = :manHour,
	D_LDAR_STAT = CURRENT_DATE,
	I_UPDATE = :updateUser,
	D_UPDATE = CURRENT_DATE
WHERE I_ID_LDAR = :id