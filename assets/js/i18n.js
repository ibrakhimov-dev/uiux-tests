/* Interfeys matnlari: uz (lotin, rasmiy imlo), ru, en, ja.
   Savollar matni dars-N/savollar.json ichida, har bir maydon { uz, ru, en, ja } ko'rinishida. */
window.I18N = {
  uz: {
    'nav.tests': 'Testlar', 'nav.docs': 'Documentation', 'menu': 'Menyu', 'skip': 'Asosiy qismga oʻtish',
    'theme.toLight': 'Yorugʻ rejimga oʻtish', 'theme.toDark': 'Qorongʻu rejimga oʻtish', 'lang': 'Til',
    'footer.made': 'UI/UX dizayn kursi · Japan Digital University', 'footer.author': 'Ibrakhimov Dev',

    'home.title': 'Bilimingizni {m} daqiqada tekshiring',
    'home.lead': 'Har dars oxirida {t} ta savol: {th} ta nazariy va {pr} ta amaliy. Natija oʻqituvchiga avtomatik yuboriladi, har bir savolning tahlili esa darhol ochiladi.',
    'chip.q': '{t} savol', 'chip.m': '{m} daqiqa', 'chip.analysis': 'Har savolga tahlil',
    'home.lessons': 'Darslar', 'card.lesson': '{n}-dars', 'card.meta': '{t} savol · {m} daqiqa', 'card.start': 'Boshlash',
    'card.best': 'Eng yaxshi natija: {s} / {t}', 'card.none': 'Hali topshirilmagan', 'card.new': 'Yangi',

    'entry.title': '{n}-dars testi', 'entry.lead': 'Maʼlumotlaringizni kiriting. Natija shu ism va ID bilan oʻqituvchiga yuboriladi.',
    'entry.name': 'Ism', 'entry.surname': 'Familiya', 'entry.id': 'Talaba ID', 'entry.idHint': 'Harf va raqamlar, masalan 25B014',
    'entry.required': 'Bu maydonni toʻldiring', 'entry.idBad': 'Faqat harf va raqamlar, 3–20 belgi',
    'entry.continue': 'Davom etish', 'fact.q': 'savol', 'fact.m': 'daqiqa', 'fact.a': 'tahlil',

    'confirm.title': 'Testni boshlaysizmi?',
    'confirm.r1': '{t} ta savol: {th} ta nazariy va {pr} ta amaliy.',
    'confirm.r2': '{m} daqiqa. Vaqt boshlangach toʻxtamaydi.',
    'confirm.r3': 'Javoblar avtomatik saqlanadi. Yakunlashdan oldin istalgan savolga qaytasiz.',
    'confirm.r4': 'Boshqa oyna yoki ilovaga oʻtsangiz, bu qayd etiladi va oʻqituvchiga koʻrinadi.',
    'confirm.r5': 'Vaqt tugasa yoki sahifani yopsangiz, test avtomatik yakunlanadi.',
    'cancel': 'Bekor qilish', 'start': 'Boshlash',

    'q.num': 'Savol {n} / {t}', 'q.theory': 'Nazariy', 'q.practice': 'Amaliy', 'q.help': 'Bitta javobni tanlang',
    'q.prev': 'Oldingi', 'q.next': 'Keyingi', 'q.finish': 'Testni yakunlash', 'q.saved': 'Saqlandi', 'q.autosave': 'Javoblar avtomatik saqlanadi',
    'map.title': 'Savollar', 'map.answered': '{a} / {t} javob berildi', 'map.done': 'Javob berilgan', 'map.empty': 'Javobsiz', 'map.cur': 'Hozirgi',
    'map.theory': 'Nazariy · 1–{th}', 'map.practice': 'Amaliy · {a}–{t}', 'map.open': 'Savollar xaritasi', 'close': 'Yopish',
    'timer.left': 'Qolgan vaqt', 'timer.note': '{m} daqiqadan · 5 daqiqa qolganda rang oʻzgaradi', 'kbd.hint': 'savollar orasida · {k} variant tanlash',
    'tr.note': 'Savollar hozircha oʻzbek tilida. Tarjimasi tez orada qoʻshiladi.',
    'toast.5': '5 daqiqa qoldi', 'toast.1': '1 daqiqa qoldi', 'toast.timeup': 'Vaqt tugadi. Test yakunlandi.',

    'un.title': '{k} ta savol javobsiz qoldi', 'un.text': 'Javobsiz savol notoʻgʻri hisoblanadi. Sizda hali {time} vaqt bor.',
    'un.back': 'Savollarga qaytish', 'un.finish': 'Baribir yakunlash',
    'fin.title': 'Testni yakunlaysizmi?', 'fin.text': 'Yakunlagandan keyin javoblarni oʻzgartirib boʻlmaydi.', 'fin.ok': 'Ha, yakunlash',
    'left.title': 'Siz testdan chiqdingiz', 'left.text': 'Boshqa oyna yoki ilovaga oʻtish qayd etildi ({n}-marta). Bu natija bilan birga oʻqituvchiga yuboriladi. Vaqt toʻxtamaydi.', 'left.ok': 'Testga qaytish',

    'res.crumb': 'Natija', 'res.pct': '{p}% · {msg}',
    'res.m85': 'Ajoyib natija!', 'res.m70': 'Yaxshi natija!', 'res.m50': 'Yomon emas — tahlilni koʻrib chiqing', 'res.m0': 'Tahlilni oʻqib, qayta urinib koʻring',
    'res.ok': 'Toʻgʻri', 'res.bad': 'Xato', 'res.skip': 'Javobsiz', 'res.spent': '{t} sarflandi', 'res.exits': 'Chiqishlar: {n}', 'res.attempt': '{n}-urinish',
    'res.timeout': 'Vaqt tugadi', 'res.left': 'Sahifa yopilgan edi',
    'send.wait': 'Natija yuborilmoqda…', 'send.ok': 'Natija oʻqituvchiga yuborildi · {time}', 'send.fail': 'Yuborib boʻlmadi. Internetni tekshiring — avtomatik qayta urinamiz.', 'send.retry': 'Qayta yuborish',
    'res.review': 'Tahlilni koʻrish', 'res.again': 'Qayta topshirish', 'res.all': '← Barcha testlar',

    'rev.title': 'Tahlil', 'rev.lead': 'Har savol: toʻgʻri javob, nega toʻgʻri va qolgan variantlar nega notoʻgʻri.',
    'rev.all': 'Hammasi · {n}', 'rev.bad': 'Xato · {n}', 'rev.skip': 'Javobsiz · {n}', 'rev.ok': 'Toʻgʻri · {n}',
    'rev.qn': '{n}-savol', 'rev.yours': 'Sizning javobingiz', 'rev.correct': 'Toʻgʻri javob', 'rev.none': 'Javob berilmagan',
    'rev.why': 'Nega toʻgʻri', 'rev.others': 'Boshqa variantlar', 'rev.doc': 'Saytda qanday qoʻllangan → Documentation · {n}-dars',
    'rev.back': 'Natijaga qaytish', 'rev.empty': 'Bu filtrda savol yoʻq',

    'docs.title': 'Documentation', 'docs.lead': 'Bu sayt kursdagi nazariyaning amaldagi namunasi. Har bir dizayn qarori qaysi darsdagi tamoyildan chiqqanini shu yerda koʻrasiz.',
    'docs.toc': 'Mundarija', 'docs.trNote': 'Bu boʻlim hozircha oʻzbek tilida.',
    'err.load': 'Savollarni yuklab boʻlmadi. Sahifani yangilang.', 'err.nolesson': 'Bunday dars topilmadi.'
  },

  ru: {
    'nav.tests': 'Тесты', 'nav.docs': 'Документация', 'menu': 'Меню', 'skip': 'Перейти к основному содержанию',
    'theme.toLight': 'Включить светлую тему', 'theme.toDark': 'Включить тёмную тему', 'lang': 'Язык',
    'footer.made': 'Курс UI/UX-дизайна · Japan Digital University', 'footer.author': 'Ibrakhimov Dev',

    'home.title': 'Проверьте свои знания за {m} минут',
    'home.lead': 'В конце каждого урока — {t} вопросов: {th} теоретических и {pr} практических. Результат автоматически отправляется преподавателю, а разбор каждого вопроса открывается сразу.',
    'chip.q': '{t} вопросов', 'chip.m': '{m} минут', 'chip.analysis': 'Разбор каждого вопроса',
    'home.lessons': 'Уроки', 'card.lesson': 'Урок {n}', 'card.meta': '{t} вопросов · {m} минут', 'card.start': 'Начать',
    'card.best': 'Лучший результат: {s} / {t}', 'card.none': 'Ещё не сдавали', 'card.new': 'Новый',

    'entry.title': 'Тест к уроку {n}', 'entry.lead': 'Введите свои данные. Результат будет отправлен преподавателю с этим именем и ID.',
    'entry.name': 'Имя', 'entry.surname': 'Фамилия', 'entry.id': 'ID студента', 'entry.idHint': 'Буквы и цифры, например 25B014',
    'entry.required': 'Заполните это поле', 'entry.idBad': 'Только буквы и цифры, 3–20 символов',
    'entry.continue': 'Продолжить', 'fact.q': 'вопросов', 'fact.m': 'минут', 'fact.a': 'разбор',

    'confirm.title': 'Начать тест?',
    'confirm.r1': '{t} вопросов: {th} теоретических и {pr} практических.',
    'confirm.r2': '{m} минут. После старта время не останавливается.',
    'confirm.r3': 'Ответы сохраняются автоматически. До завершения можно вернуться к любому вопросу.',
    'confirm.r4': 'Если вы перейдёте в другую вкладку или приложение, это будет зафиксировано и видно преподавателю.',
    'confirm.r5': 'Когда время закончится или вы закроете страницу, тест завершится автоматически.',
    'cancel': 'Отмена', 'start': 'Начать',

    'q.num': 'Вопрос {n} / {t}', 'q.theory': 'Теория', 'q.practice': 'Практика', 'q.help': 'Выберите один ответ',
    'q.prev': 'Назад', 'q.next': 'Далее', 'q.finish': 'Завершить тест', 'q.saved': 'Сохранено', 'q.autosave': 'Ответы сохраняются автоматически',
    'map.title': 'Вопросы', 'map.answered': 'Отвечено: {a} / {t}', 'map.done': 'Есть ответ', 'map.empty': 'Без ответа', 'map.cur': 'Текущий',
    'map.theory': 'Теория · 1–{th}', 'map.practice': 'Практика · {a}–{t}', 'map.open': 'Карта вопросов', 'close': 'Закрыть',
    'timer.left': 'Осталось времени', 'timer.note': 'Из {m} минут · за 5 минут до конца цвет меняется', 'kbd.hint': 'между вопросами · {k} выбор ответа',
    'tr.note': 'Вопросы пока на узбекском языке. Перевод скоро появится.',
    'toast.5': 'Осталось 5 минут', 'toast.1': 'Осталась 1 минута', 'toast.timeup': 'Время вышло. Тест завершён.',

    'un.title': 'Без ответа: {k}', 'un.text': 'Вопрос без ответа считается неверным. У вас ещё есть {time}.',
    'un.back': 'Вернуться к вопросам', 'un.finish': 'Всё равно завершить',
    'fin.title': 'Завершить тест?', 'fin.text': 'После завершения ответы изменить нельзя.', 'fin.ok': 'Да, завершить',
    'left.title': 'Вы покинули тест', 'left.text': 'Переход в другую вкладку или приложение зафиксирован ({n}-й раз). Это будет отправлено преподавателю вместе с результатом. Время не останавливается.', 'left.ok': 'Вернуться к тесту',

    'res.crumb': 'Результат', 'res.pct': '{p}% · {msg}',
    'res.m85': 'Отличный результат!', 'res.m70': 'Хороший результат!', 'res.m50': 'Неплохо — посмотрите разбор', 'res.m0': 'Изучите разбор и попробуйте снова',
    'res.ok': 'Верно', 'res.bad': 'Ошибка', 'res.skip': 'Без ответа', 'res.spent': 'Затрачено: {t}', 'res.exits': 'Выходы: {n}', 'res.attempt': 'Попытка {n}',
    'res.timeout': 'Время вышло', 'res.left': 'Страница была закрыта',
    'send.wait': 'Отправляем результат…', 'send.ok': 'Результат отправлен преподавателю · {time}', 'send.fail': 'Не удалось отправить. Проверьте интернет — мы повторим автоматически.', 'send.retry': 'Отправить снова',
    'res.review': 'Посмотреть разбор', 'res.again': 'Пройти ещё раз', 'res.all': '← Все тесты',

    'rev.title': 'Разбор', 'rev.lead': 'Для каждого вопроса: верный ответ, почему он верный и почему остальные варианты неверны.',
    'rev.all': 'Все · {n}', 'rev.bad': 'Ошибки · {n}', 'rev.skip': 'Без ответа · {n}', 'rev.ok': 'Верно · {n}',
    'rev.qn': 'Вопрос {n}', 'rev.yours': 'Ваш ответ', 'rev.correct': 'Верный ответ', 'rev.none': 'Нет ответа',
    'rev.why': 'Почему верно', 'rev.others': 'Остальные варианты', 'rev.doc': 'Как это применено на сайте → Документация · урок {n}',
    'rev.back': 'Вернуться к результату', 'rev.empty': 'В этом фильтре нет вопросов',

    'docs.title': 'Документация', 'docs.lead': 'Этот сайт — практический пример теории курса. Здесь видно, из какого принципа какого урока выросло каждое дизайн-решение.',
    'docs.toc': 'Содержание', 'docs.trNote': 'Этот раздел пока на узбекском языке.',
    'err.load': 'Не удалось загрузить вопросы. Обновите страницу.', 'err.nolesson': 'Такой урок не найден.'
  },

  en: {
    'nav.tests': 'Tests', 'nav.docs': 'Documentation', 'menu': 'Menu', 'skip': 'Skip to main content',
    'theme.toLight': 'Switch to light mode', 'theme.toDark': 'Switch to dark mode', 'lang': 'Language',
    'footer.made': 'UI/UX Design course · Japan Digital University', 'footer.author': 'Ibrakhimov Dev',

    'home.title': 'Check what you know in {m} minutes',
    'home.lead': 'Each lesson ends with {t} questions: {th} on theory and {pr} on practice. Your result goes to your teacher automatically, and the explanation for every question opens right away.',
    'chip.q': '{t} questions', 'chip.m': '{m} minutes', 'chip.analysis': 'Explanation for every question',
    'home.lessons': 'Lessons', 'card.lesson': 'Lesson {n}', 'card.meta': '{t} questions · {m} min', 'card.start': 'Start',
    'card.best': 'Best result: {s} / {t}', 'card.none': 'Not taken yet', 'card.new': 'New',

    'entry.title': 'Lesson {n} test', 'entry.lead': 'Enter your details. Your result will be sent to your teacher under this name and ID.',
    'entry.name': 'First name', 'entry.surname': 'Last name', 'entry.id': 'Student ID', 'entry.idHint': 'Letters and numbers, e.g. 25B014',
    'entry.required': 'Please fill in this field', 'entry.idBad': 'Letters and numbers only, 3–20 characters',
    'entry.continue': 'Continue', 'fact.q': 'questions', 'fact.m': 'minutes', 'fact.a': 'explained',

    'confirm.title': 'Start the test?',
    'confirm.r1': '{t} questions: {th} on theory and {pr} on practice.',
    'confirm.r2': '{m} minutes. Once started, the timer does not stop.',
    'confirm.r3': 'Answers are saved automatically. You can go back to any question before you finish.',
    'confirm.r4': 'If you switch to another tab or app, it is recorded and your teacher will see it.',
    'confirm.r5': 'When time runs out or you close the page, the test finishes automatically.',
    'cancel': 'Cancel', 'start': 'Start',

    'q.num': 'Question {n} / {t}', 'q.theory': 'Theory', 'q.practice': 'Practice', 'q.help': 'Choose one answer',
    'q.prev': 'Previous', 'q.next': 'Next', 'q.finish': 'Finish test', 'q.saved': 'Saved', 'q.autosave': 'Answers are saved automatically',
    'map.title': 'Questions', 'map.answered': '{a} / {t} answered', 'map.done': 'Answered', 'map.empty': 'Unanswered', 'map.cur': 'Current',
    'map.theory': 'Theory · 1–{th}', 'map.practice': 'Practice · {a}–{t}', 'map.open': 'Question map', 'close': 'Close',
    'timer.left': 'Time left', 'timer.note': 'Out of {m} minutes · colour changes with 5 minutes left', 'kbd.hint': 'between questions · {k} to choose',
    'tr.note': 'Questions are in Uzbek for now. The translation is coming soon.',
    'toast.5': '5 minutes left', 'toast.1': '1 minute left', 'toast.timeup': 'Time is up. The test has finished.',

    'un.title': '{k} unanswered', 'un.text': 'An unanswered question counts as wrong. You still have {time}.',
    'un.back': 'Back to questions', 'un.finish': 'Finish anyway',
    'fin.title': 'Finish the test?', 'fin.text': 'After finishing you cannot change your answers.', 'fin.ok': 'Yes, finish',
    'left.title': 'You left the test', 'left.text': 'Switching to another tab or app was recorded (time {n}). It will be sent to your teacher with your result. The timer keeps running.', 'left.ok': 'Back to the test',

    'res.crumb': 'Result', 'res.pct': '{p}% · {msg}',
    'res.m85': 'Excellent result!', 'res.m70': 'Good result!', 'res.m50': 'Not bad — look through the explanations', 'res.m0': 'Read the explanations and try again',
    'res.ok': 'Correct', 'res.bad': 'Wrong', 'res.skip': 'Unanswered', 'res.spent': '{t} spent', 'res.exits': 'Exits: {n}', 'res.attempt': 'Attempt {n}',
    'res.timeout': 'Time ran out', 'res.left': 'The page was closed',
    'send.wait': 'Sending your result…', 'send.ok': 'Result sent to your teacher · {time}', 'send.fail': 'Could not send. Check your internet — we will retry automatically.', 'send.retry': 'Send again',
    'res.review': 'See explanations', 'res.again': 'Take it again', 'res.all': '← All tests',

    'rev.title': 'Explanations', 'rev.lead': 'For each question: the correct answer, why it is correct, and why the other options are wrong.',
    'rev.all': 'All · {n}', 'rev.bad': 'Wrong · {n}', 'rev.skip': 'Unanswered · {n}', 'rev.ok': 'Correct · {n}',
    'rev.qn': 'Question {n}', 'rev.yours': 'Your answer', 'rev.correct': 'Correct answer', 'rev.none': 'Not answered',
    'rev.why': 'Why it is correct', 'rev.others': 'The other options', 'rev.doc': 'How this site uses it → Documentation · Lesson {n}',
    'rev.back': 'Back to result', 'rev.empty': 'No questions in this filter',

    'docs.title': 'Documentation', 'docs.lead': 'This site is a working example of the course theory. Here you can see which lesson principle each design decision came from.',
    'docs.toc': 'Contents', 'docs.trNote': 'This section is in Uzbek for now.',
    'err.load': 'Could not load the questions. Please refresh the page.', 'err.nolesson': 'Lesson not found.'
  },

  ja: {
    'nav.tests': 'テスト', 'nav.docs': 'ドキュメント', 'menu': 'メニュー', 'skip': '本文へスキップ',
    'theme.toLight': 'ライトモードに切り替え', 'theme.toDark': 'ダークモードに切り替え', 'lang': '言語',
    'footer.made': 'UI/UXデザイン講座 · Japan Digital University', 'footer.author': 'Ibrakhimov Dev',

    'home.title': '{m}分で理解度をチェック',
    'home.lead': '各レッスンの最後に{t}問：理論{th}問、実践{pr}問。結果は自動で先生に送信され、すべての問題の解説がすぐに確認できます。',
    'chip.q': '{t}問', 'chip.m': '{m}分', 'chip.analysis': '全問に解説つき',
    'home.lessons': 'レッスン', 'card.lesson': '第{n}回', 'card.meta': '{t}問 · {m}分', 'card.start': '開始',
    'card.best': 'ベスト：{s} / {t}', 'card.none': '未受験', 'card.new': '新着',

    'entry.title': '第{n}回 テスト', 'entry.lead': '情報を入力してください。結果はこの名前とIDで先生に送信されます。',
    'entry.name': '名', 'entry.surname': '姓', 'entry.id': '学生ID', 'entry.idHint': '英字と数字（例：25B014）',
    'entry.required': 'この項目を入力してください', 'entry.idBad': '英字と数字のみ、3〜20文字',
    'entry.continue': '次へ', 'fact.q': '問', 'fact.m': '分', 'fact.a': '解説',

    'confirm.title': 'テストを開始しますか？',
    'confirm.r1': '全{t}問：理論{th}問、実践{pr}問。',
    'confirm.r2': '制限時間は{m}分。開始後、タイマーは止まりません。',
    'confirm.r3': '回答は自動で保存されます。終了するまで、どの問題にも戻れます。',
    'confirm.r4': '別のタブやアプリに切り替えると記録され、先生に表示されます。',
    'confirm.r5': '時間切れ、またはページを閉じると、テストは自動で終了します。',
    'cancel': 'キャンセル', 'start': '開始',

    'q.num': '問題 {n} / {t}', 'q.theory': '理論', 'q.practice': '実践', 'q.help': '答えを1つ選んでください',
    'q.prev': '前へ', 'q.next': '次へ', 'q.finish': 'テストを終了', 'q.saved': '保存済み', 'q.autosave': '回答は自動で保存されます',
    'map.title': '問題一覧', 'map.answered': '回答済み {a} / {t}', 'map.done': '回答済み', 'map.empty': '未回答', 'map.cur': '現在',
    'map.theory': '理論 · 1–{th}', 'map.practice': '実践 · {a}–{t}', 'map.open': '問題マップ', 'close': '閉じる',
    'timer.left': '残り時間', 'timer.note': '全{m}分 · 残り5分で色が変わります', 'kbd.hint': '問題の移動 · {k} で選択',
    'tr.note': '問題文は現在ウズベク語のみです。翻訳はまもなく追加されます。',
    'toast.5': '残り5分です', 'toast.1': '残り1分です', 'toast.timeup': '時間切れです。テストを終了しました。',

    'un.title': '未回答が{k}問あります', 'un.text': '未回答の問題は不正解として扱われます。残り時間は{time}です。',
    'un.back': '問題に戻る', 'un.finish': 'このまま終了',
    'fin.title': 'テストを終了しますか？', 'fin.text': '終了後は回答を変更できません。', 'fin.ok': 'はい、終了します',
    'left.title': 'テストから離れました', 'left.text': '別のタブやアプリへの切り替えが記録されました（{n}回目）。結果と一緒に先生に送信されます。タイマーは止まりません。', 'left.ok': 'テストに戻る',

    'res.crumb': '結果', 'res.pct': '{p}% · {msg}',
    'res.m85': 'すばらしい結果です！', 'res.m70': 'よくできました！', 'res.m50': 'まずまずです。解説を確認しましょう', 'res.m0': '解説を読んで、もう一度挑戦しましょう',
    'res.ok': '正解', 'res.bad': '不正解', 'res.skip': '未回答', 'res.spent': '所要時間 {t}', 'res.exits': '離脱：{n}回', 'res.attempt': '{n}回目の受験',
    'res.timeout': '時間切れ', 'res.left': 'ページが閉じられました',
    'send.wait': '結果を送信しています…', 'send.ok': '結果を先生に送信しました · {time}', 'send.fail': '送信できませんでした。インターネット接続を確認してください。自動で再送します。', 'send.retry': '再送信',
    'res.review': '解説を見る', 'res.again': 'もう一度受ける', 'res.all': '← テスト一覧',

    'rev.title': '解説', 'rev.lead': '各問題の正解、その理由、そしてほかの選択肢が誤りである理由。',
    'rev.all': 'すべて · {n}', 'rev.bad': '不正解 · {n}', 'rev.skip': '未回答 · {n}', 'rev.ok': '正解 · {n}',
    'rev.qn': '問題 {n}', 'rev.yours': 'あなたの回答', 'rev.correct': '正解', 'rev.none': '未回答',
    'rev.why': '正解の理由', 'rev.others': 'ほかの選択肢', 'rev.doc': 'このサイトでの使われ方 → ドキュメント · 第{n}回',
    'rev.back': '結果に戻る', 'rev.empty': 'この条件に当てはまる問題はありません',

    'docs.title': 'ドキュメント', 'docs.lead': 'このサイトは講座の理論を実際に形にした例です。それぞれのデザイン上の判断が、どのレッスンの原則から生まれたのかをここで確認できます。',
    'docs.toc': '目次', 'docs.trNote': 'このページは現在ウズベク語のみです。',
    'err.load': '問題を読み込めませんでした。ページを再読み込みしてください。', 'err.nolesson': 'レッスンが見つかりません。'
  }
};
