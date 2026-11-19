import type { Locale } from "./i18n";

export type DocLocale = Locale;

const LOCALES: DocLocale[] = ["tr", "en", "de", "ar", "ru"];

export function docLocale(value: unknown): DocLocale {
  return LOCALES.includes(value as DocLocale) ? (value as DocLocale) : "tr";
}

export function localeFromNotes(notes?: string | null): DocLocale {
  const match = notes?.match(/locale:(tr|en|de|ar|ru)/i);
  return docLocale(match?.[1]?.toLowerCase());
}

export function withLocaleNote(notes: string, locale: DocLocale): string {
  const clean = notes.replace(/\s*·?\s*locale:(tr|en|de|ar|ru)/gi, "").trim();
  return [clean, `locale:${locale}`].filter(Boolean).join(" · ");
}

export function stripLocaleNote(notes?: string | null): string {
  return (notes || "").replace(/\s*·?\s*locale:(tr|en|de|ar|ru)/gi, "").replace(/^[\s·]+|[\s·]+$/g, "").trim();
}

export type ReservationDoc = {
  intl: string;
  fileName: string;
  mailSubject: string;
  mailHeadline: string;
  mailDear: string;
  mailBody: string;
  mailPnr: string;
  mailVehicle: string;
  mailPickup: string;
  mailDropoff: string;
  mailPhone: string;
  mailHandover: string;
  pdfTitle: string;
  pdfNo: string;
  pdfDate: string;
  pdfBadge: string;
  pdfGreeting: string;
  pdfCustomerSection: string;
  pdfDeliverySection: string;
  pdfPriceSection: string;
  pdfCustomer: string;
  pdfPhone: string;
  pdfBirth: string;
  pdfFlight: string;
  pdfArrival: string;
  pdfReturn: string;
  pdfNote: string;
  pdfLicense: string;
  pdfVehicle: string;
  pdfSpec: string;
  pdfPickupWhen: string;
  pdfPickupWhere: string;
  pdfReturnWhen: string;
  pdfReturnWhere: string;
  pdfDuration: string;
  pdfRental: string;
  pdfDrop: string;
  pdfDiscount: string;
  pdfColDesc: string;
  pdfColDuration: string;
  pdfColDaily: string;
  pdfColTotal: string;
  pdfPayable: string;
  pdfDeposit: string;
  pdfKm: string;
  pdfReminders: string[];
  pdfFarewell: string;
  pdfSectionReminders: string;
  extras: Record<string, string>;
};

const tr: ReservationDoc = {
  intl: "tr-TR",
  fileName: "ZakCar Rezervasyon Onayi",
  mailSubject: "Tebrikler, rezervasyonunuz oluştu",
  mailHeadline: "Tebrikler, rezervasyonunuz oluştu.",
  mailDear: "Sayın {name},",
  mailBody: "ZakCar rezervasyonunuz başarıyla oluşturuldu. Onay belgeniz bu e-postanın ekinde.",
  mailPnr: "PNR",
  mailVehicle: "Araç",
  mailPickup: "Alış",
  mailDropoff: "Bırakış",
  mailPhone: "Telefon",
  mailHandover: "Teslimde kimliğinizi ve sürücü belgenizi yanınızda bulundurun. Ödeme araç tesliminde alınır.",
  pdfTitle: "REZERVASYON ONAYI",
  pdfNo: "No",
  pdfDate: "Tarih",
  pdfBadge: "REZERVASYON ONAYLANDI",
  pdfGreeting: "Sayın {name}, araç rezervasyon talebiniz başarıyla oluşturulmuştur.",
  pdfCustomerSection: "MÜŞTERİ VE ARAÇ BİLGİLERİ",
  pdfDeliverySection: "TESLİMAT VE İADE BİLGİLERİ",
  pdfPriceSection: "FİYATLANDIRMA ÖZETİ",
  pdfCustomer: "Müşteri Adı Soyadı:",
  pdfPhone: "Telefon:",
  pdfBirth: "Doğum Tarihi:",
  pdfFlight: "Uçuş No:",
  pdfArrival: "Geliş Uçuş No",
  pdfReturn: "Dönüş Uçuş No",
  pdfNote: "Not",
  pdfLicense: "Ehliyet",
  pdfVehicle: "Kiralanan Araç:",
  pdfSpec: "Vites / Yakıt:",
  pdfPickupWhen: "Alış Tarihi & Saati:",
  pdfPickupWhere: "Alış Lokasyonu:",
  pdfReturnWhen: "İade Tarihi & Saati:",
  pdfReturnWhere: "İade Lokasyonu:",
  pdfDuration: "{days} Gün ({weekday} iade)",
  pdfRental: "{name} Araç Kiralama Bedeli",
  pdfDrop: "Drop ücreti",
  pdfDiscount: "İndirim",
  pdfColDesc: "AÇIKLAMA",
  pdfColDuration: "SÜRE",
  pdfColDaily: "GÜNLÜK FİYAT",
  pdfColTotal: "TOPLAM TUTAR",
  pdfPayable: "Ödenecek Toplam Tutar",
  pdfDeposit: "Depozito",
  pdfKm: "{days} gün için yol hakkı {km} km’dir.",
  pdfReminders: [
    "Araç teslim alma sırasında T.C. kimlik belgenizi ve sürücü ehliyetinizi yanınızda bulundurmanız gerekmektedir.",
    "Kiralama süresince oluşabilecek HGS / otoyol geçiş ücretleri ve trafik cezaları sürücü sorumluluğundadır.",
    "Rezervasyon güncellemeleri veya sorularınız için 7/24 müşteri hizmetlerimizle iletişime geçebilirsiniz.",
  ],
  pdfFarewell: "Zak Rent A Car ailesi olarak iyi yolculuklar dileriz!",
  pdfSectionReminders: "ÖNEMLİ HATIRLATMALAR",
  extras: {
    driver: "Ek Sürücü",
    young: "Genç Sürücü Paketi",
    hgs: "HGS",
    child: "Çocuk Koltuğu",
    winter: "Kış Lastiği",
  },
};

const en: ReservationDoc = {
  ...tr,
  intl: "en-GB",
  fileName: "ZakCar Reservation Confirmation",
  mailSubject: "Your reservation is confirmed",
  mailHeadline: "Your reservation is confirmed.",
  mailDear: "Dear {name},",
  mailBody: "Your ZakCar reservation has been created. The confirmation is attached to this email.",
  mailPnr: "PNR",
  mailVehicle: "Vehicle",
  mailPickup: "Pick-up",
  mailDropoff: "Drop-off",
  mailPhone: "Phone",
  mailHandover: "Please bring your identity card and driving licence to the handover. Payment is taken when you collect the car.",
  pdfTitle: "RESERVATION CONFIRMATION",
  pdfNo: "No",
  pdfDate: "Date",
  pdfBadge: "RESERVATION CONFIRMED",
  pdfGreeting: "Dear {name}, your vehicle reservation has been created.",
  pdfCustomerSection: "CUSTOMER AND VEHICLE",
  pdfDeliverySection: "PICK-UP AND RETURN",
  pdfPriceSection: "PRICE SUMMARY",
  pdfCustomer: "Customer name:",
  pdfPhone: "Phone:",
  pdfBirth: "Date of birth:",
  pdfFlight: "Flight no:",
  pdfArrival: "Arrival flight",
  pdfReturn: "Return flight",
  pdfNote: "Note",
  pdfLicense: "Licence",
  pdfVehicle: "Vehicle:",
  pdfSpec: "Gear / Fuel:",
  pdfPickupWhen: "Pick-up date & time:",
  pdfPickupWhere: "Pick-up location:",
  pdfReturnWhen: "Return date & time:",
  pdfReturnWhere: "Return location:",
  pdfDuration: "{days} days (return {weekday})",
  pdfRental: "{name} rental",
  pdfDrop: "Drop-off fee",
  pdfDiscount: "Discount",
  pdfColDesc: "DESCRIPTION",
  pdfColDuration: "DURATION",
  pdfColDaily: "DAILY PRICE",
  pdfColTotal: "TOTAL",
  pdfPayable: "Amount due",
  pdfDeposit: "Deposit",
  pdfKm: "Mileage allowance for {days} days is {km} km.",
  pdfReminders: [
    "Please bring your identity card and driving licence when you collect the car.",
    "HGS / toll charges and traffic fines during the rental are the driver's responsibility.",
    "For changes or questions, you can reach our customer service 24/7.",
  ],
  pdfFarewell: "The Zak Rent A Car team wishes you a good journey.",
  pdfSectionReminders: "IMPORTANT NOTES",
  extras: {
    driver: "Additional driver",
    young: "Young driver package",
    hgs: "HGS",
    child: "Child seat",
    winter: "Winter tyres",
  },
};

const de: ReservationDoc = {
  ...tr,
  intl: "de-DE",
  fileName: "ZakCar Reservierungsbestaetigung",
  mailSubject: "Ihre Reservierung ist bestätigt",
  mailHeadline: "Ihre Reservierung ist bestätigt.",
  mailDear: "Guten Tag {name},",
  mailBody: "Ihre ZakCar-Reservierung wurde erstellt. Die Bestätigung finden Sie im Anhang dieser E-Mail.",
  mailVehicle: "Fahrzeug",
  mailPickup: "Abholung",
  mailDropoff: "Rückgabe",
  mailPhone: "Telefon",
  mailHandover: "Bitte bringen Sie Ausweis und Führerschein zur Übergabe mit. Die Zahlung erfolgt bei der Fahrzeugübergabe.",
  pdfTitle: "RESERVIERUNGSBESTÄTIGUNG",
  pdfNo: "Nr",
  pdfDate: "Datum",
  pdfBadge: "RESERVIERUNG BESTÄTIGT",
  pdfGreeting: "Guten Tag {name}, Ihre Fahrzeugreservierung wurde erstellt.",
  pdfCustomerSection: "KUNDE UND FAHRZEUG",
  pdfDeliverySection: "ABHOLUNG UND RÜCKGABE",
  pdfPriceSection: "PREISÜBERSICHT",
  pdfCustomer: "Name des Kunden:",
  pdfPhone: "Telefon:",
  pdfBirth: "Geburtsdatum:",
  pdfFlight: "Flugnr.:",
  pdfArrival: "Ankunftsflug",
  pdfReturn: "Rückflug",
  pdfNote: "Notiz",
  pdfLicense: "Führerschein",
  pdfVehicle: "Fahrzeug:",
  pdfSpec: "Getriebe / Kraftstoff:",
  pdfPickupWhen: "Abholung Datum & Uhrzeit:",
  pdfPickupWhere: "Abholort:",
  pdfReturnWhen: "Rückgabe Datum & Uhrzeit:",
  pdfReturnWhere: "Rückgabeort:",
  pdfDuration: "{days} Tage (Rückgabe {weekday})",
  pdfRental: "{name} Mietpreis",
  pdfDrop: "Abgabegebühr",
  pdfDiscount: "Rabatt",
  pdfColDesc: "BESCHREIBUNG",
  pdfColDuration: "DAUER",
  pdfColDaily: "TAGESPREIS",
  pdfColTotal: "SUMME",
  pdfPayable: "Zu zahlender Betrag",
  pdfDeposit: "Kaution",
  pdfKm: "Das Kilometerkontingent für {days} Tage beträgt {km} km.",
  pdfReminders: [
    "Bitte bringen Sie Ausweis und Führerschein zur Fahrzeugübergabe mit.",
    "HGS-/Mautgebühren und Bußgelder während der Miete trägt der Fahrer.",
    "Für Änderungen oder Fragen erreichen Sie unseren Kundendienst rund um die Uhr.",
  ],
  pdfFarewell: "Das Team von Zak Rent A Car wünscht eine gute Fahrt.",
  pdfSectionReminders: "WICHTIGE HINWEISE",
  extras: {
    driver: "Zusatzfahrer",
    young: "Jungfahrer-Paket",
    hgs: "HGS",
    child: "Kindersitz",
    winter: "Winterreifen",
  },
};

const ar: ReservationDoc = {
  ...tr,
  intl: "ar",
  fileName: "ZakCar Reservation Confirmation",
  mailSubject: "تم تأكيد حجزك",
  mailHeadline: "تم تأكيد حجزك.",
  mailDear: "عزيزي {name}،",
  mailBody: "تم إنشاء حجز ZakCar. وثيقة التأكيد مرفقة بهذه الرسالة.",
  mailVehicle: "السيارة",
  mailPickup: "الاستلام",
  mailDropoff: "التسليم",
  mailPhone: "الهاتف",
  mailHandover: "يرجى إحضار بطاقة الهوية ورخصة القيادة عند الاستلام. يتم الدفع عند تسليم السيارة.",
  pdfTitle: "تأكيد الحجز",
  pdfNo: "رقم",
  pdfDate: "التاريخ",
  pdfBadge: "تم تأكيد الحجز",
  pdfGreeting: "عزيزي {name}، تم إنشاء طلب حجز السيارة.",
  pdfCustomerSection: "العميل والسيارة",
  pdfDeliverySection: "الاستلام والإعادة",
  pdfPriceSection: "ملخص السعر",
  pdfCustomer: "اسم العميل:",
  pdfPhone: "الهاتف:",
  pdfBirth: "تاريخ الميلاد:",
  pdfFlight: "رقم الرحلة:",
  pdfArrival: "رحلة الوصول",
  pdfReturn: "رحلة العودة",
  pdfNote: "ملاحظة",
  pdfLicense: "الرخصة",
  pdfVehicle: "السيارة:",
  pdfSpec: "ناقل الحركة / الوقود:",
  pdfPickupWhen: "تاريخ ووقت الاستلام:",
  pdfPickupWhere: "مكان الاستلام:",
  pdfReturnWhen: "تاريخ ووقت الإعادة:",
  pdfReturnWhere: "مكان الإعادة:",
  pdfDuration: "{days} أيام (الإعادة {weekday})",
  pdfRental: "أجرة {name}",
  pdfDrop: "رسوم التسليم",
  pdfDiscount: "خصم",
  pdfColDesc: "البيان",
  pdfColDuration: "المدة",
  pdfColDaily: "السعر اليومي",
  pdfColTotal: "المجموع",
  pdfPayable: "المبلغ المستحق",
  pdfDeposit: "التأمين",
  pdfKm: "حد المسافة لـ {days} أيام هو {km} كم.",
  pdfReminders: [
    "يرجى إحضار بطاقة الهوية ورخصة القيادة عند استلام السيارة.",
    "رسوم HGS والطرق والغرامات خلال الإيجار على مسؤولية السائق.",
    "للتعديل أو الاستفسار يمكنكم التواصل مع خدمة العملاء على مدار الساعة.",
  ],
  pdfFarewell: "يتمنى لكم فريق Zak Rent A Car رحلة سعيدة.",
  pdfSectionReminders: "ملاحظات مهمة",
  extras: {
    driver: "سائق إضافي",
    young: "باقة السائق الشاب",
    hgs: "HGS",
    child: "مقعد طفل",
    winter: "إطارات شتوية",
  },
};

const ru: ReservationDoc = {
  ...tr,
  intl: "ru-RU",
  fileName: "ZakCar Podtverzhdenie bronirovaniya",
  mailSubject: "Бронирование подтверждено",
  mailHeadline: "Бронирование подтверждено.",
  mailDear: "Здравствуйте, {name},",
  mailBody: "Бронирование ZakCar создано. Подтверждение во вложении к этому письму.",
  mailVehicle: "Автомобиль",
  mailPickup: "Получение",
  mailDropoff: "Возврат",
  mailPhone: "Телефон",
  mailHandover: "Возьмите с собой удостоверение личности и водительские права. Оплата при получении автомобиля.",
  pdfTitle: "ПОДТВЕРЖДЕНИЕ БРОНИ",
  pdfNo: "№",
  pdfDate: "Дата",
  pdfBadge: "БРОНЬ ПОДТВЕРЖДЕНА",
  pdfGreeting: "Здравствуйте, {name}, заявка на аренду автомобиля создана.",
  pdfCustomerSection: "КЛИЕНТ И АВТОМОБИЛЬ",
  pdfDeliverySection: "ПОЛУЧЕНИЕ И ВОЗВРАТ",
  pdfPriceSection: "СТОИМОСТЬ",
  pdfCustomer: "Имя клиента:",
  pdfPhone: "Телефон:",
  pdfBirth: "Дата рождения:",
  pdfFlight: "Номер рейса:",
  pdfArrival: "Рейс прибытия",
  pdfReturn: "Обратный рейс",
  pdfNote: "Примечание",
  pdfLicense: "Права",
  pdfVehicle: "Автомобиль:",
  pdfSpec: "КПП / топливо:",
  pdfPickupWhen: "Дата и время получения:",
  pdfPickupWhere: "Место получения:",
  pdfReturnWhen: "Дата и время возврата:",
  pdfReturnWhere: "Место возврата:",
  pdfDuration: "{days} дн. (возврат {weekday})",
  pdfRental: "Аренда {name}",
  pdfDrop: "Плата за возврат",
  pdfDiscount: "Скидка",
  pdfColDesc: "ОПИСАНИЕ",
  pdfColDuration: "СРОК",
  pdfColDaily: "ЦЕНА В ДЕНЬ",
  pdfColTotal: "СУММА",
  pdfPayable: "К оплате",
  pdfDeposit: "Депозит",
  pdfKm: "Лимит пробега на {days} дн. — {km} км.",
  pdfReminders: [
    "Возьмите удостоверение личности и водительские права при получении автомобиля.",
    "Плата HGS / за дороги и штрафы во время аренды — ответственность водителя.",
    "По изменениям и вопросам служба поддержки работает круглосуточно.",
  ],
  pdfFarewell: "Команда Zak Rent A Car желает хорошей поездки.",
  pdfSectionReminders: "ВАЖНЫЕ НАПОМИНАНИЯ",
  extras: {
    driver: "Доп. водитель",
    young: "Пакет молодого водителя",
    hgs: "HGS",
    child: "Детское кресло",
    winter: "Зимние шины",
  },
};

const DOCS: Record<DocLocale, ReservationDoc> = { tr, en, de, ar, ru };

export function reservationDoc(locale: DocLocale): ReservationDoc {
  return DOCS[locale];
}

export function fillDoc(template: string, vars: Record<string, string | number>): string {
  let text = template;
  for (const [key, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${key}}`, String(value));
  }
  return text;
}
