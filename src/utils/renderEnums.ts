export enum CheckupRecordStatus {
	CHO_TAI_KHAM,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_KHAM,
	CHO_THANH_TOAN_XN,
	CHECKED_IN_SAU_XN,
	CHO_KET_QUA_XN,
	DA_CO_KET_QUA_XN,
	KET_THUC,
	CHUYEN_KHOA,
	NHAP_VIEN,
	DA_HUY,
	DA_XOA,
}

export const CHECKUP_TRANSLATION: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Chờ khám',
	CHECKED_IN: 'Đã checkin',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Đã chỉ định xét nghiệm',
	CHECKED_IN_SAU_XN: 'Đã có KQXN',
	CHO_KET_QUA_XN: 'Chờ KQXN',
	DA_CO_KET_QUA_XN: 'Đã có KQXN',
	KET_THUC: 'Kết thúc',
	CHUYEN_KHOA: 'Chuyển khoa',
	NHAP_VIEN: 'Nhập viện',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}
export const CHECKUP_TRANSLATION_RE_EXAM: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	DA_THANH_TOAN: 'Tái khám',
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	CHECKED_IN: 'Đã checkin',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Đã chỉ định xét nghiệm',
	CHECKED_IN_SAU_XN: 'Đã có KQXN',
	CHO_KET_QUA_XN: 'Chờ KQXN',
	DA_CO_KET_QUA_XN: 'Đã có KQXN (tái khám)',
	KET_THUC: 'Kết thúc',
	CHUYEN_KHOA: 'Chuyển khoa',
	NHAP_VIEN: 'Nhập viện',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const renderEnumCheckupRecordStatus = (status: number) =>
	CheckupRecordStatus[status]

export const translateCheckupRecordStatus = (
	status: number,
	isReExam = false
) =>
	isReExam
		? CHECKUP_TRANSLATION_RE_EXAM[
				CheckupRecordStatus[status] as keyof typeof CheckupRecordStatus
		  ]
		: CHECKUP_TRANSLATION[
				CheckupRecordStatus[status] as keyof typeof CheckupRecordStatus
		  ]

export enum InsuranceSupportStatus {
	'Không hỗ trợ',
	'Một phần',
	'Toàn phần',
}

export const renderEnumInsuranceStatus = (status: number) =>
	InsuranceSupportStatus[status]

export enum LoginStatus {
	THANH_CONG,
	INVALID_TOKEN,
	EXPIRED_TOKEN,
	THAT_BAI,
	CAN_DIEN_THONG_TIN,
	KHONG_THUOC_CA_LAM_VIEC,
}

export enum SessionType {
	SANG,
	CHIEU,
	TOI,
}

export const SESSION_TRANSLATION: {
	[key in keyof typeof SessionType]: string
} = {
	SANG: 'Sáng',
	CHIEU: 'Chiều',
	TOI: 'Tối',
}

export const translateSession = (status: number) =>
	SESSION_TRANSLATION[SessionType[status] as keyof typeof SessionType]

export enum TestRecordStatus {
	CHUA_DAT_LICH,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_TIEN_HANH,
	CHO_KET_QUA,
	HOAN_THANH,
	DA_HUY,
	DA_XOA,
}
