import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { mapValues } from 'lodash'

let messages = {
  en: {
    'Báo cáo': 'Report',
    'Thông tin ứng viên': '',
    'Thông tin cá nhân': 'Information',
    'Đăng xuất': 'Logout',
    'Thông báo': 'Notifications',
    'Bộ Lọc': 'Filter',
    'Lọc': 'Filter',
    'Nguồn': 'Source',
    'Ngày bắt đầu': 'Start date',
    'Ngày kết thúc': 'End date',
    'Bộ lọc dùng chung cho các biểu đồ dưới đây': 'Global filter for all metric',
    'Nguồn ứng viên': 'Applicant Source',
    'Tổng ứng viên': '',
    'số lượng ứng viên đang có trong database': '',
    'Ứng viên chưa đi làm': '',
    'ứng viên đang available': '',
    'Ứng viên chờ phỏng vấn': '',
    'ứng viên đã chuyển cho đối tác và đang chờ kết quả': '',
    'Ứng viên convert thành công': '',
    'ứng viên đi làm tại các công ty của đối tác': '',
    'Lượng ứng viên': '',
    'Lượng lead đổ về theo ngày': '',
    'Chất lượng nguồn': '',
    '3 ngày gần đây': '',
    '1 tuần gần đây': '',
    '1 tháng gần đây': '',
    '3 tháng gần đây': '',
    'Tỉ lệ chuyển đổi ứng viên': '',
    'Tính theo ngày lead về': '',
    'Tất cả lead': '',
    'Ứng viên đang process': '',
    'Ứng viên Pass': '',
    // Marketing -> Applicant
    'Thêm ứng viên': '',
    'Họ và Tên': '',
    'Chứng minh nhân dân': '',
    'Nam': '',
    'Nữ': '',
    'Số điện thoại': '',
    'Tỉnh': '',
    'Chọn tỉnh': '',
    'Ngày sinh': '',
    'Đánh dấu source_id': '',
    'Chọn source_id': '',
    'Tên Tag': '',
    'Nội dung Tag': '',
    'Gắn tag ứng viên': '',
    'Tag đã tồn tại': '',
    'Không được thêm tag trống': '',
    'Không thể kết nối đến máy chủ': 'Could not connect to server',
    'Hôm nay':'Today',
    'Tuần này': '',
    'Ngày mai': '',
    'Ngày kia':''
  },
  vi: {}
}

messages.vi = mapValues(messages.en, (value, key) => key)

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'vi',
  messages,
  silentTranslationWarn: true
})

export const listLang = ['en', 'vi']
