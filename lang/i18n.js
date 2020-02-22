let T = {
    locale: null,
    locales: {}, //语言包内容
    langCode: ['zh_fan','zh_jian']
}

T.registerLocale = function (locales) {
    T.locales = locales;//将语言包里的对象赋给当前对象的locales属性
}

T.setLocale = function (code) {
    T.locale = code;//存储当前语言的种类('zh_jian'或者'zh_fan')
}

T.setLocaleByIndex = function (index) {
    T.setLocale(T.langCode[index]);
}

T.getLanguage = function (pageName) {
    return T.locales[T.locale][pageName];
}

export default T;
