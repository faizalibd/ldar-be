UPDATE DBAPDM.TMLDAR
SET I_ID_PGMMODEL = :modelId,
	I_LDAR_PHONE = :phone,
	-- N_LDAR_SUBMITBY = :submittedBy
	-- C_LDAR_LSNUNIT = :LSNUnit,
	A_LDAR_LOC = :location,
	C_LDAR_REFBY = :refCode,
	I_LDAR_REFBY = :refNumber,
	C_LDAR_VER = :version,
	I_DRAW = :drawingNumber,
	C_LDAR_IDX = :drawingIndex,
	E_LDAR_DESIGNATION = :drawingDesignation,
	E_LDAR_REMARK = :remark,
	D_LDAR_STAT = CURRENT_DATE,
	I_UPDATE = :updateUser,
	D_UPDATE = CURRENT_DATE
WHERE I_ID_LDAR = :id