UPDATE DBAPDM.TMLDAR
SET E_LDAR_DISPORSN = :acceptedReason,
	E_LDAR_PLANREVIEW = :planningReview,
	F_LDAR_DRAWSEE = :drawingFlag,
	F_LDAR_OTHR = :otherFlag,
	F_LDAR_RSN = :reasonFlag,
	F_LDAR_INDICAT = :indicatedFlag,
	I_UPDATE = :updateUser,
	D_UPDATE = CURRENT_DATE
WHERE I_ID_LDAR = :id