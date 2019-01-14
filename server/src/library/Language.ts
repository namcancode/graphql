const dictionaries = {
    en: {
        'Sai tên đăng nhập hoặc mật khẩu': 'Wrong password or username'
    },
    vi: {

    }
}

let currentLang: string = 'vi'

export function $t(message: string) {
    return dictionaries[currentLang][message] || message
}

export function setLang(lang: string) {
    currentLang = lang
}