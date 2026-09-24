import { SITE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";

type Copy = Record<Locale, string>;

export type FaqItem = {
  id: string;
  q: Copy;
  a: Copy;
};

export type FaqCategory = {
  id: string;
  title: Copy;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "booking",
    title: {
      tr: "Rezervasyon & İptal",
      en: "Reservation & cancellation",
      de: "Reservierung & Stornierung",
      ru: "Бронь и отмена",
      ar: "الحجز والإلغاء",
    },
    items: [
      {
        id: "how",
        q: {
          tr: "Nasıl rezervasyon yapabilirim?",
          en: "How can I make a reservation?",
          de: "Wie kann ich reservieren?",
          ru: "Как забронировать автомобиль?",
          ar: "كيف أحجز سيارة؟",
        },
        a: {
          tr: "zakcar.com üzerinden alış yerini ve tarihleri seçip uygun aracı birkaç adımda rezerve edebilirsiniz. Ayrıca 7/24 WhatsApp hattımız {whatsapp} veya çağrı merkezimiz {phone} üzerinden de rezervasyon yapılır. E-posta: {email}.",
          en: "Pick a location and dates on zakcar.com and book in a few steps. You can also reserve 24/7 via WhatsApp {whatsapp} or our call center {phone}. Email: {email}.",
          de: "Wählen Sie auf zakcar.com Ort und Daten und buchen Sie in wenigen Schritten. Reservierung auch rund um die Uhr per WhatsApp {whatsapp} oder Callcenter {phone}. E-Mail: {email}.",
          ru: "Выберите место и даты на zakcar.com и забронируйте за несколько шагов. Также круглосуточно: WhatsApp {whatsapp} или колл-центр {phone}. Почта: {email}.",
          ar: "اختر الموقع والتواريخ على zakcar.com وأكمل الحجز في خطوات قليلة. كما يمكنك الحجز على مدار الساعة عبر واتساب {whatsapp} أو مركز الاتصال {phone}. البريد: {email}.",
        },
      },
      {
        id: "prepaid",
        q: {
          tr: "Rezervasyon ücretli mi? Ön ödeme var mı?",
          en: "Is the reservation free? Is there a prepayment?",
          de: "Ist die Reservierung kostenlos? Gibt es eine Vorauszahlung?",
          ru: "Бронь платная? Есть ли предоплата?",
          ar: "هل الحجز مجاني؟ هل هناك دفعة مسبقة؟",
        },
        a: {
          tr: "Hayır. Rezervasyon ücretsizdir, ön ödeme alınmaz. Kira bedelini araç tesliminde nakit, banka kartı veya kredi kartı ile ödersiniz.",
          en: "No. Booking is free and there is no prepayment. You pay the rental when you collect the car — cash, debit or credit card.",
          de: "Nein. Die Reservierung ist kostenlos, ohne Vorauszahlung. Sie zahlen bei der Fahrzeugübergabe bar, per Debit- oder Kreditkarte.",
          ru: "Нет. Бронь бесплатная, предоплаты нет. Оплата при получении авто — наличные, дебетовая или кредитная карта.",
          ar: "لا. الحجز مجاني وبدون دفعة مسبقة. تدفع الإيجار عند استلام السيارة نقداً أو ببطاقة خصم أو ائتمان.",
        },
      },
      {
        id: "cancel",
        q: {
          tr: "Rezervasyonu iptal edebilir miyim? İade nasıl olur?",
          en: "Can I cancel? How do refunds work?",
          de: "Kann ich stornieren? Wie funktioniert die Erstattung?",
          ru: "Можно ли отменить бронь? Как возврат?",
          ar: "هل يمكنني الإلغاء؟ كيف يتم الاسترداد؟",
        },
        a: {
          tr: "Teslim saatine 24 saat kalaya kadar rezervasyonunuzu ücretsiz iptal edebilirsiniz. Online kart ile ön ödeme yaptıysanız iade genelde 3 iş günü içinde kartınıza yansır. Son dakika iptal, no-show ve erken iade kuralları Kiralama Koşulları sayfasındadır.",
          en: "You can cancel free of charge up to 24 hours before pickup. Card prepayments are usually refunded within 3 business days. Late cancel, no-show and early-return rules are on the Rental Terms page.",
          de: "Bis 24 Stunden vor der Abholung können Sie kostenlos stornieren. Kartenvorauszahlungen werden in der Regel innerhalb von 3 Werktagen erstattet. Details zu Spätstorno, No-Show und vorzeitiger Rückgabe stehen in den Mietbedingungen.",
          ru: "Бесплатная отмена не позднее чем за 24 часа до выдачи. Возврат предоплаты на карту обычно занимает 3 рабочих дня. Правила поздней отмены, неявки и раннего возврата — на странице условий аренды.",
          ar: "يمكنك الإلغاء مجاناً حتى 24 ساعة قبل الاستلام. تُعاد الدفعات عبر البطاقة عادة خلال 3 أيام عمل. شروط الإلغاء المتأخر وعدم الحضور والإرجاع المبكر في صفحة شروط التأجير.",
        },
      },
      {
        id: "group",
        q: {
          tr: "Rezervasyon yaptığım modeli kesin alacak mıyım?",
          en: "Am I guaranteed the exact model I booked?",
          de: "Bekomme ich genau das gebuchte Modell?",
          ru: "Гарантирована ли конкретная модель?",
          ar: "هل أضمن الطراز الذي حجزته؟",
        },
        a: {
          tr: "Rezervasyonlar araç grubuna onaylanır; marka, renk veya model garantisi verilmez. Rezerve ettiğiniz grupta müsaitlik yoksa aynı fiyata bir üst segment teslim edilir.",
          en: "Bookings are confirmed by vehicle group, not a specific brand, colour or model. If that group is unavailable we provide a higher segment at the same price.",
          de: "Reservierungen gelten für die Fahrzeuggruppe, nicht für Marke, Farbe oder Modell. Ist die Gruppe nicht verfügbar, erhalten Sie ein höheres Segment zum gleichen Preis.",
          ru: "Бронь подтверждается по классу авто, а не по марке, цвету или модели. Если класса нет — выдадим сегмент выше по той же цене.",
          ar: "يُؤكَّد الحجز حسب فئة السيارة وليس ماركة أو لوناً أو طرازاً محدداً. إن لم تتوفر الفئة نسلم فئة أعلى بنفس السعر.",
        },
      },
      {
        id: "duration",
        q: {
          tr: "Aracı aldıktan sonra kira süresini değiştirebilir miyim?",
          en: "Can I change the rental period after pickup?",
          de: "Kann ich die Mietdauer nach der Abholung ändern?",
          ru: "Можно ли изменить срок после получения?",
          ar: "هل يمكن تغيير مدة الإيجار بعد الاستلام؟",
        },
        a: {
          tr: "Evet. Süreyi uzatmak için çağrı merkezimizi arayın; ek günler geçerli tarifeden tahsil edilir. Erken iadede ücret kullanılan gün sayısına göre yeniden hesaplanır. En kısa kiralama 24 saattir.",
          en: "Yes. Call us to extend — extra days are charged at the current rate. Early returns are recalculated for the days used. The minimum rental is 24 hours.",
          de: "Ja. Zur Verlängerung rufen Sie uns an; Zusatztage gelten zum aktuellen Tarif. Bei vorzeitiger Rückgabe wird nach genutzten Tagen neu berechnet. Mindestmietdauer: 24 Stunden.",
          ru: "Да. Для продления позвоните нам — доп. дни по действующему тарифу. При раннем возврате пересчёт по фактическим дням. Минимум — 24 часа.",
          ar: "نعم. للتمديد اتصل بنا؛ تُحتسب الأيام الإضافية بالتعرفة السارية. في الإرجاع المبكر يُعاد الحساب حسب الأيام المستخدمة. الحد الأدنى 24 ساعة.",
        },
      },
    ],
  },
  {
    id: "payment",
    title: {
      tr: "Ödeme & Fatura",
      en: "Payment & invoice",
      de: "Zahlung & Rechnung",
      ru: "Оплата и счёт",
      ar: "الدفع والفاتورة",
    },
    items: [
      {
        id: "nocard",
        q: {
          tr: "Kredi kartı olmadan araç kiralayabilir miyim?",
          en: "Can I rent without a credit card?",
          de: "Kann ich ohne Kreditkarte mieten?",
          ru: "Можно ли арендовать без кредитной карты?",
          ar: "هل يمكن التأجير بدون بطاقة ائتمان؟",
        },
        a: {
          tr: "Evet. Nakit veya banka kartıyla kiralama yapılabilir. Rezervasyon ücretsizdir; ödemeyi araç tesliminde alırsınız. Depozito seçenekleri teslim sırasında netleştirilir.",
          en: "Yes. You can pay with cash or a debit card. Booking is free; payment is at pickup. Deposit options are confirmed when you collect the car.",
          de: "Ja. Zahlung bar oder per Debitkarte ist möglich. Die Reservierung ist kostenlos; Zahlung bei der Übergabe. Die Kaution klären wir bei der Abholung.",
          ru: "Да. Можно наличными или дебетовой картой. Бронь бесплатная, оплата при выдаче. Депозит уточняется при получении.",
          ar: "نعم. يمكن الدفع نقداً أو ببطاقة خصم. الحجز مجاني والدفع عند الاستلام. خيارات التأمين تُوضَّح عند التسليم.",
        },
      },
      {
        id: "findeks",
        q: {
          tr: "Findeks sorgusu yapılıyor mu?",
          en: "Do you run a Findeks / credit check?",
          de: "Wird eine Findeks-/Bonitätsprüfung gemacht?",
          ru: "Проверяете ли вы Findeks / кредитную историю?",
          ar: "هل تجرون فحص فيندكس أو ائتمان؟",
        },
        a: {
          tr: "Hayır. ZakCar’da kredi kartsız ve Findeks sorgusuz kiralama mümkündür. Geçerli ehliyet ve kimlik yeterlidir.",
          en: "No. ZakCar does not require a Findeks or credit check. A valid licence and ID are enough.",
          de: "Nein. Bei ZakCar gibt es keine Findeks- oder Bonitätsprüfung. Führerschein und Ausweis reichen.",
          ru: "Нет. У ZakCar нет проверки Findeks или кредитной истории. Достаточно прав и удостоверения.",
          ar: "لا. لا نطلب فحص فيندكس أو ائتمان. رخصة قيادة سارية وهوية كافية.",
        },
      },
      {
        id: "deposit",
        q: {
          tr: "Depozito nedir, ne zaman iade edilir?",
          en: "What is the deposit and when is it refunded?",
          de: "Was ist die Kaution und wann wird sie erstattet?",
          ru: "Что такое депозит и когда его возвращают?",
          ar: "ما هو التأمين ومتى يُعاد؟",
        },
        a: {
          tr: "Depozito, kira bedeli dışında alınan teminattır. Tutar araç grubuna göre rezervasyonda görünür. Araç teslim edildiği gibi iade edilirse depozito tamamen geri verilir.",
          en: "The deposit is a security hold besides the rental fee. The amount is shown by vehicle group at booking. If the car is returned as delivered, the deposit is fully refunded.",
          de: "Die Kaution ist eine Sicherheit zusätzlich zur Miete. Der Betrag steht bei der Buchung je nach Gruppe. Wird das Auto wie übergeben zurückgegeben, wird die Kaution vollständig erstattet.",
          ru: "Депозит — залог сверх аренды. Сумма видна при брони по классу авто. Если машина возвращена как при выдаче, депозит возвращается полностью.",
          ar: "التأمين مبلغ ضمان إضافة إلى الإيجار. يظهر حسب فئة السيارة عند الحجز. إذا أُعيدت السيارة كما سُلمت يُرد التأمين بالكامل.",
        },
      },
      {
        id: "invoice",
        q: {
          tr: "Faturamı ne zaman alırım?",
          en: "When do I receive the invoice?",
          de: "Wann erhalte ich die Rechnung?",
          ru: "Когда придёт счёт?",
          ar: "متى تصلني الفاتورة؟",
        },
        a: {
          tr: "Kiralama bittikten sonra faturanız, rezervasyondaki e-posta adresinize birkaç iş günü içinde gönderilir. Gecikirse {email} veya {phone} ile yazın.",
          en: "After the rental ends we email the invoice to the address on your booking within a few business days. If it is late, contact {email} or {phone}.",
          de: "Nach Mietende senden wir die Rechnung innerhalb weniger Werktage an die E-Mail der Reservierung. Bei Verzögerung: {email} oder {phone}.",
          ru: "После окончания аренды счёт уходит на e-mail брони за несколько рабочих дней. Если задержится — {email} или {phone}.",
          ar: "بعد انتهاء التأجير تُرسل الفاتورة إلى بريد الحجز خلال أيام عمل. إن تأخرت تواصل مع {email} أو {phone}.",
        },
      },
    ],
  },
  {
    id: "rules",
    title: {
      tr: "Kiralama Koşulları",
      en: "Rental conditions",
      de: "Mietbedingungen",
      ru: "Условия аренды",
      ar: "شروط التأجير",
    },
    items: [
      {
        id: "age",
        q: {
          tr: "Araç kiralamak için kaç yaşında olmalıyım?",
          en: "What is the minimum age and licence requirement?",
          de: "Welches Mindestalter und welcher Führerschein gelten?",
          ru: "Какой минимальный возраст и стаж?",
          ar: "ما الحد الأدنى للعمر ورخصة القيادة؟",
        },
        a: {
          tr: "Genelde 21 yaş ve en az 3 yıllık B sınıfı ehliyet gerekir. Bazı gruplarda yaş / ehliyet yılı daha yüksek olabilir; şartlar araç sayfasında yazılır. Teslimde ehliyet ibrazı ve sözleşme imzası zorunludur.",
          en: "Usually 21 years old and a category B licence held for at least 3 years. Some groups require more; check the vehicle page. You must show your licence and sign the contract at pickup.",
          de: "In der Regel 21 Jahre und seit mindestens 3 Jahren Klasse B. Manche Gruppen verlangen mehr — siehe Fahrzeugseite. Führerschein und Unterschrift bei der Abholung sind Pflicht.",
          ru: "Обычно 21 год и права категории B не менее 3 лет. Для части классов требования выше — смотрите карточку авто. При выдаче нужны права и подпись договора.",
          ar: "عادة 21 عاماً ورخصة فئة B لمدة 3 سنوات على الأقل. بعض الفئات تتطلب أكثر؛ راجع صفحة السيارة. يجب إبراز الرخصة وتوقيع العقد عند الاستلام.",
        },
      },
      {
        id: "docs",
        q: {
          tr: "Sözleşme için hangi belgeler gerekir?",
          en: "Which documents do I need?",
          de: "Welche Unterlagen brauche ich?",
          ru: "Какие документы нужны?",
          ar: "ما المستندات المطلوبة؟",
        },
        a: {
          tr: "Geçerli ehliyet, kimlik veya pasaport ve iletişim bilgileri. Yurt dışından geliyorsanız giriş damgalı pasaport da gerekir. Sözleşme nüshasını mutlaka alın; e-postanıza da gönderilir.",
          en: "A valid driving licence, ID or passport, and your contact details. Visitors from abroad also need a stamped entry passport. Keep a copy of the contract; we also email it.",
          de: "Gültiger Führerschein, Ausweis oder Reisepass und Kontaktdaten. Aus dem Ausland zusätzlich der Einreisestempel im Pass. Bewahren Sie eine Vertragskopie auf; wir senden sie per E-Mail.",
          ru: "Действующие права, паспорт или удостоверение и контакты. Из-за рубежа нужен паспорт со штампом въезда. Сохраните копию договора — она также придёт на почту.",
          ar: "رخصة سارية، هوية أو جواز، وبيانات التواصل. القادمون من الخارج يحتاجون جواز الدخول المختوم. احتفظ بنسخة العقد؛ نرسلها أيضاً بالبريد.",
        },
      },
      {
        id: "extra",
        q: {
          tr: "Ek sürücü ekleyebilir miyim?",
          en: "Can I add an extra driver?",
          de: "Kann ich einen Zusatzfahrer anmelden?",
          ru: "Можно ли добавить второго водителя?",
          ar: "هل يمكن إضافة سائق إضافي؟",
        },
        a: {
          tr: "Evet. Ek sürücü teslimde ehliyetini ibraz eder ve sözleşmeyi imzalar. Sözleşmede yazmayan kişilerin kullanımı kaskoyu geçersiz kılar. Başkasına ait kartla ödeme ancak kart sahibi ek sürücü olarak ofiste bulunursa mümkündür.",
          en: "Yes. Extra drivers must show a licence and sign at pickup. Anyone not on the contract voids insurance. A third-party card is only accepted if the cardholder is present as an extra driver.",
          de: "Ja. Zusatzfahrer müssen Führerschein vorlegen und unterschreiben. Nicht im Vertrag genannte Fahrer machen die Versicherung ungültig. Eine fremde Karte nur, wenn der Karteninhaber als Zusatzfahrer vor Ort ist.",
          ru: "Да. Доп. водитель показывает права и подписывает договор. Вождение лицом вне договора аннулирует страховку. Чужая карта — только если владелец присутствует как доп. водитель.",
          ar: "نعم. يجب أن يبرز السائق الإضافي رخصته ويوقّع عند التسليم. قيادة غير المدرجين في العقد تُبطل التأمين. بطاقة الغير تُقبل فقط إذا حضر صاحبها كسائق إضافي.",
        },
      },
    ],
  },
  {
    id: "delivery",
    title: {
      tr: "Teslim & İade",
      en: "Pickup & return",
      de: "Abholung & Rückgabe",
      ru: "Выдача и возврат",
      ar: "الاستلام والإرجاع",
    },
    items: [
      {
        id: "airport",
        q: {
          tr: "Havalimanında teslim nasıl olur?",
          en: "How does airport pickup work?",
          de: "Wie funktioniert die Abholung am Flughafen?",
          ru: "Как проходит выдача в аэропорту?",
          ar: "كيف يتم التسليم في المطار؟",
        },
        a: {
          tr: "Sabiha Gökçen, İstanbul Havalimanı ve Merkez Ofis’te 7/24 teslim yapılır. Uçuşunuzu takip eder, bagaj süresini bekleriz. Konum ve personel bilgisi teslimden önce SMS / e-posta ile gelir. Otopark ücreti ZakCar’a aittir.",
          en: "Pickup is 24/7 at Sabiha Gökçen, Istanbul Airport and our Central Office. We track your flight and wait for baggage. Location and staff details are sent by SMS/email before pickup. Parking is paid by ZakCar.",
          de: "Abholung rund um die Uhr an Sabiha Gökçen, Flughafen Istanbul und im Zentralbüro. Wir verfolgen Ihren Flug und warten auf das Gepäck. Ort und Kontakt kommen per SMS/E-Mail. Parkgebühren trägt ZakCar.",
          ru: "Выдача 24/7 в Сабиха Гёкчен, аэропорту Стамбул и центральном офисе. Следим за рейсом и ждём багаж. Место и контакт придут по SMS/e-mail. Парковку оплачивает ZakCar.",
          ar: "التسليم على مدار الساعة في صبيحة كوكجن ومطار إسطنبول والمكتب الرئيسي. نتابع رحلتك وننتظر الأمتعة. يُرسل الموقع وبيانات الموظف قبل التسليم. رسوم الموقف على ZakCar.",
        },
      },
      {
        id: "other",
        q: {
          tr: "Aracı farklı ofise bırakabilir miyim?",
          en: "Can I drop the car at another office?",
          de: "Kann ich das Auto in einem anderen Büro zurückgeben?",
          ru: "Можно ли сдать авто в другом офисе?",
          ar: "هل يمكن إرجاع السيارة في مكتب آخر؟",
        },
        a: {
          tr: "Evet, tek yön ücreti karşılığında. Tutar ofislere göre değişir; rezervasyon veya çağrı merkezinden netleşir. Adres tesliminde 10 km üzeri mesafelerde ek teslim ücreti uygulanabilir.",
          en: "Yes, for a one-way fee that depends on the offices. Confirm it at booking or with the call center. Home delivery beyond 10 km from a branch may also have a fee.",
          de: "Ja, gegen eine Einweggebühr je nach Büros. Klären Sie den Betrag bei der Buchung oder im Callcenter. Zustellung mehr als 10 km von einer Filiale kann extra kosten.",
          ru: "Да, за one-way сбор, который зависит от офисов. Уточните при брони или в колл-центре. Доставка дальше 10 км от филиала может быть платной.",
          ar: "نعم مقابل رسوم اتجاه واحد حسب المكتبين. أكّد المبلغ عند الحجز أو عبر مركز الاتصال. التسليم لعنوان أبعد من 10 كم قد يكون برسوم.",
        },
      },
      {
        id: "late",
        q: {
          tr: "Teslimde gecikirsem ne olur?",
          en: "What if I am late returning the car?",
          de: "Was passiert bei verspäteter Rückgabe?",
          ru: "Что если я опоздаю с возвратом?",
          ar: "ماذا لو تأخرت في الإرجاع؟",
        },
        a: {
          tr: "Gecikmeyi çağrı merkezine bildirin. Yaklaşık 2 saate kadar esneklik tanınır; aşılırsa veya haber verilmezse o günün kira bedeli alınır. No-show’da araç yaklaşık 1 saat bekletilir, 2 saatte rezervasyon iptal olabilir.",
          en: "Tell the call center if you will be late. About 2 hours of flexibility applies; after that, or without notice, a full extra day may be charged. For no-show we wait about 1 hour; after 2 hours the booking can be cancelled.",
          de: "Melden Sie Verspätungen dem Callcenter. Etwa 2 Stunden Spielraum; danach oder ohne Hinweis kann ein weiterer Miettag anfallen. Bei No-Show warten wir ca. 1 Stunde; nach 2 Stunden kann die Reservierung entfallen.",
          ru: "Сообщите в колл-центр, если опаздываете. Около 2 часов запас; дальше или без уведомления может списаться сутки. При неявке ждём около часа; через 2 часа бронь могут отменить.",
          ar: "أبلغ مركز الاتصال عند التأخير. مرونة نحو ساعتين؛ بعدها أو دون إشعار قد تُحتسب يوم إضافي. في عدم الحضور ننتظر نحو ساعة وقد يُلغى الحجز بعد ساعتين.",
        },
      },
    ],
  },
  {
    id: "fuel",
    title: {
      tr: "Yakıt, HGS & Ceza",
      en: "Fuel, HGS & fines",
      de: "Kraftstoff, HGS & Strafen",
      ru: "Топливо, HGS и штрафы",
      ar: "الوقود وHGS والغرامات",
    },
    items: [
      {
        id: "fuel",
        q: {
          tr: "Yakıt politikası nedir?",
          en: "What is the fuel policy?",
          de: "Wie ist die Tankregelung?",
          ru: "Какая политика по топливу?",
          ar: "ما سياسة الوقود؟",
        },
        a: {
          tr: "Araçlar genelde boş depo teslim edilir ve aynı şekilde iade alınır; ya da teslim edildiği kadar yakıtla geri verilir. Böylece yanlış yakıt hesabı olmaz.",
          en: "Cars are usually handed over with an empty tank and returned the same way, or with the same fuel level as at pickup. This avoids fuel disputes.",
          de: "Fahrzeuge werden meist mit leerem Tank übergeben und so zurückgegeben — oder mit dem gleichen Stand wie bei der Abholung. So gibt es keine Tankstreitigkeiten.",
          ru: "Обычно авто выдают с пустым баком и принимают так же — либо с тем же уровнем, что при выдаче. Так нет споров по топливу.",
          ar: "تُسلَّم السيارات عادة بخزان فارغ وتُعاد كذلك، أو بنفس مستوى الوقود عند التسليم لتفادي الخلاف.",
        },
      },
      {
        id: "hgs",
        q: {
          tr: "Araçlarda HGS var mı? Trafik cezası kime ait?",
          en: "Do cars have HGS? Who pays traffic fines?",
          de: "Haben die Autos HGS? Wer zahlt Strafen?",
          ru: "Есть ли HGS? Кто платит штрафы?",
          ar: "هل في السيارات HGS؟ من يدفع المخالفات؟",
        },
        a: {
          tr: "Evet, filodaki araçlarda HGS vardır. Geçişler ve plakaya yazılan cezalar kiralama sürenize aitse size fatura edilir veya kartınızdan tahsil edilir. Belge e-posta ile gönderilir.",
          en: "Yes, fleet cars have HGS. Tolls and plate fines from your rental period are billed to you or charged to your card. Documents are emailed.",
          de: "Ja, die Fahrzeuge haben HGS. Maut und Kennzeichenstrafen aus Ihrer Mietzeit werden Ihnen berechnet oder von der Karte abgebucht. Belege per E-Mail.",
          ru: "Да, в авто есть HGS. Платные дороги и штрафы за период аренды выставляются вам или списываются с карты. Документы приходят на почту.",
          ar: "نعم، السيارات مزودة بـ HGS. رسوم الطرق والمخالفات خلال فترة التأجير تُفوتر لك أو تُخصم من البطاقة. تُرسل المستندات بالبريد.",
        },
      },
    ],
  },
  {
    id: "damage",
    title: {
      tr: "Hasar & Destek",
      en: "Damage & support",
      de: "Schaden & Support",
      ru: "Повреждения и поддержка",
      ar: "الضرر والدعم",
    },
    items: [
      {
        id: "accident",
        q: {
          tr: "Kaza olursa ne yapmalıyım?",
          en: "What should I do in case of an accident?",
          de: "Was tun bei einem Unfall?",
          ru: "Что делать при ДТП?",
          ar: "ماذا أفعل عند وقوع حادث؟",
        },
        a: {
          tr: "Aracı yerinden oynatmadan polis veya jandarmayı arayın, kaza / alkol raporu alın. Hemen 7/24 hattımızı {phone} veya WhatsApp {whatsapp} arayın. Sigortanın geçerli olması için ihbar ve resmi tutanak şarttır.",
          en: "Do not move the car. Call the police or gendarmerie and get an accident / alcohol report. Then call us 24/7 on {phone} or WhatsApp {whatsapp}. Insurance needs official reports and prompt notice.",
          de: "Fahrzeug nicht versetzen. Polizei oder Jandarma rufen und Unfall-/Alkoholbericht holen. Danach rund um die Uhr {phone} oder WhatsApp {whatsapp}. Für die Versicherung sind Meldung und Protokoll Pflicht.",
          ru: "Не трогайте авто. Вызовите полицию или жандармерию, возьмите протокол и справку об алкоголе. Сразу звоните 24/7: {phone} или WhatsApp {whatsapp}. Для страховки нужны уведомление и официальные документы.",
          ar: "لا تحرّك السيارة. اتصل بالشرطة أو الدرك واحصل على تقرير الحادث والكحول. ثم اتصل على مدار الساعة {phone} أو واتساب {whatsapp}. التأمين يتطلب إبلاغاً ومحضراً رسمياً.",
        },
      },
      {
        id: "km",
        q: {
          tr: "Kilometre sınırı var mı?",
          en: "Is there a mileage limit?",
          de: "Gibt es eine Kilometerbegrenzung?",
          ru: "Есть ли лимит пробега?",
          ar: "هل هناك حد للكيلومترات؟",
        },
        a: {
          tr: "Adil kullanım esastır. Dahil kilometre rezervasyonda “fiyata dahil olanlar” kısmında yazılır. Aşım ücreti orada belirtilen tutara göre hesaplanır. Katalogda 10 günlük rezervasyon için 3000 km hakkı örnek olarak geçer.",
          en: "Fair use applies. Included kilometres are listed under “what’s included” at booking. Overage is charged at the stated rate. The catalogue example is 3,000 km on a 10-day booking.",
          de: "Fair Use gilt. Inklusivkilometer stehen bei der Buchung unter „im Preis enthalten“. Mehrkilometer zum angegebenen Satz. Katalogbeispiel: 3000 km bei 10 Tagen.",
          ru: "Действует справедливый лимит. Включённый пробег указан в брони. Превышение — по указанной ставке. В каталоге пример: 3000 км на 10 дней.",
          ar: "يُطبَّق الاستخدام العادل. الكيلومترات المشمولة تظهر عند الحجز. التجاوز يُحسب بالسعر المعلن. مثال الكتالوج: 3000 كم لحجز 10 أيام.",
        },
      },
    ],
  },
];

export const FAQ_HOME_IDS = ["how", "prepaid", "nocard", "findeks", "age", "airport"] as const;

export function fillFaq(text: string) {
  return text
    .replaceAll("{phone}", SITE.phone)
    .replaceAll("{whatsapp}", SITE.whatsappDisplay)
    .replaceAll("{email}", SITE.email);
}

export function allFaqItems() {
  return FAQ_CATEGORIES.flatMap((c) => c.items);
}

export function faqForLocale(locale: Locale) {
  return FAQ_CATEGORIES.map((cat) => ({
    id: cat.id,
    title: cat.title[locale],
    items: cat.items.map((item) => ({
      id: item.id,
      q: item.q[locale],
      a: fillFaq(item.a[locale]),
    })),
  }));
}

export function homeFaqForLocale(locale: Locale) {
  const wanted = new Set<string>(FAQ_HOME_IDS);
  return allFaqItems()
    .filter((item) => wanted.has(item.id))
    .map((item) => ({
      id: item.id,
      q: item.q[locale],
      a: fillFaq(item.a[locale]),
    }));
}

export function faqJsonLd(locale: Locale = "tr") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems().map((item) => ({
      "@type": "Question",
      name: item.q[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: fillFaq(item.a[locale]),
      },
    })),
  };
}
