import type { Locale } from "@/lib/i18n";

export type Blurb = { area: string; around: string; drive: string };

type Foreign = Exclude<Locale, "tr">;

export const DISTRICT_BLURBS: Record<string, Record<Foreign, Blurb>> = {
  "etiler-arac-kiralama": {
    en: {
      area: "Etiler sits on the Nispetiye and Akatlar ridges of Beşiktaş, where the university and housing streets run into each other.",
      around: "Akmerkez, Nispetiye Caddesi and the Ulus–Bebek line are a short drive from Etiler. The roads down to the Bosphorus are steep, so leave time before a meeting or a visit.",
      drive: "The side streets inside the blocks are narrow, and kerbside space fills up in the evening. It is easier to leave the car in a car park and walk the Nispetiye side.",
    },
    de: {
      area: "Etiler liegt auf den Höhen von Nispetiye und Akatlar in Beşiktaş, wo Universität und Wohnstraßen ineinander übergehen.",
      around: "Akmerkez, die Nispetiye Caddesi und die Linie Ulus–Bebek sind von Etiler aus kurz mit dem Auto zu erreichen. Die Straßen hinunter zum Bosporus sind steil, planen Sie Zeit vor einem Termin ein.",
      drive: "Die Straßen in den Anlagen sind eng, und am Abend sind die Ränder voll. Bequemer ist es, das Auto in ein Parkhaus zu stellen und die Nispetiye-Seite zu Fuß zu gehen.",
    },
    ar: {
      area: "إتيلر على مرتفعات نيسبيتييه وأكاتلار في بشيكتاش، حيث تختلط شوارع الجامعة بالمساكن.",
      around: "أك مركز وشارع نيسبيتييه وخط أولوس–ببيك قريبون بالسيارة من إتيلر. الطرق النازلة إلى البوسفور منحدرة، فاتركوا وقتاً قبل موعد أو زيارة.",
      drive: "الشوارع داخل المجمعات ضيقة، والمواقف على الرصيف تمتلئ مساءً. الأسهل ترك السيارة في موقف والمشي في جهة نيسبيتييه.",
    },
    ru: {
      area: "Этилер стоит на хребтах Nispetiye и Акатлар в Бешикташе, где университетские и жилые улицы сходятся.",
      around: "Akmerkez, Nispetiye Caddesi и линия Улус–Бебек — короткая поездка из Этилера. Спуски к Босфору крутые, перед встречей заложите запас времени.",
      drive: "Улицы внутри кварталов узкие, вечером места у обочины заканчиваются. Проще оставить машину на парковке и пройти сторону Nispetiye пешком.",
    },
  },
  "levent-arac-kiralama": {
    en: {
      area: "Levent is the business spine of the European side, with the towers on Büyükdere Caddesi and the metro line.",
      around: "The 4. Levent and Levent metro stops, Zincirlikuyu and Maslak sit on the same line. If you have several towers in one day, a car cuts the transfer time.",
      drive: "On weekday mornings Büyükdere Caddesi and the ring roads fill up. A tower car park is a more predictable place to leave the car than the kerb.",
    },
    de: {
      area: "Levent ist die Geschäftsachse der europäischen Seite, mit den Türmen an der Büyükdere Caddesi und der Metro.",
      around: "Die Metrostationen 4. Levent und Levent, Zincirlikuyu und Maslak liegen auf derselben Linie. Bei mehreren Türmen an einem Tag verkürzt das Auto die Umstiege.",
      drive: "An Werktagsmorgen werden die Büyükdere Caddesi und die Ringstraßen voll. Ein Parkhaus im Turm ist berechenbarer als der Straßenrand.",
    },
    ar: {
      area: "ليفنت محور الأعمال في الجانب الأوروبي، بأبراجه على شارع بيوك دره وخط المترو.",
      around: "محطتا 4. ليفنت وليفنت وزينجيرليكويو وماسلاك على الخط نفسه. إذا كان لديكم أكثر من برج في اليوم، السيارة تختصر وقت التنقل.",
      drive: "صباح أيام الأسبوع يمتلئ شارع بيوك دره والطرق الدائرية. موقف البرج أوضح من الرصيف.",
    },
    ru: {
      area: "Левент — деловая ось европейской стороны: башни на Büyükdere Caddesi и линия метро.",
      around: "Станции 4. Levent и Levent, Зинджирликую и Маслак на одной линии. Если за день несколько башен, машина сокращает пересадки.",
      drive: "По будням утром Büyükdere Caddesi и кольцевые забиты. Парковка башни предсказуемее обочины.",
    },
  },
  "maslak-arac-kiralama": {
    en: {
      area: "Maslak is the office district gathered on the Sarıyer edge, opening onto the forest road.",
      around: "Büyükdere runs from Levent to Maslak. Side roads lead to İstinye and Ayazağa. It is on the same side as Istanbul Airport, so you do not need the bridge.",
      drive: "The main road slows at the start and end of the working day. Asking about the tower car park in advance helps you not miss the handover time.",
    },
    de: {
      area: "Maslak ist das Büroviertel an der Grenze zu Sarıyer, das sich zur Waldstraße öffnet.",
      around: "Die Büyükdere-Achse führt von Levent nach Maslak, Seitenstraßen nach İstinye und Ayazağa. Es liegt auf derselben Seite wie der Istanbul Airport, die Brücke entfällt.",
      drive: "Zu Arbeitsbeginn und -ende wird die Hauptstraße langsam. Fragen Sie das Parkhaus des Turms vorher, damit die Übergabezeit nicht verpasst wird.",
    },
    ar: {
      area: "ماسلاك منطقة المكاتب عند حدود ساريير، وتفتح على طريق الغابة.",
      around: "محور بيوك دره يصل ليفنت بماسلاك، والطرق الجانبية إلى إستينيه وأيازاغا. هي في جهة مطار إسطنبول نفسها، بلا حاجة إلى الجسر.",
      drive: "الشارع الرئيسي يبطؤ في بداية الدوام ونهايته. السؤال عن موقف البرج مسبقاً يمنع تفويت وقت التسليم.",
    },
    ru: {
      area: "Маслак — офисный район у границы Сарыер, выходящий к лесной дороге.",
      around: "Ось Бююкдере ведёт из Левента в Маслак, боковые дороги — в Истинье и Аязагу. Район на той же стороне, что аэропорт Стамбула, мост не нужен.",
      drive: "Главная улица замедляется в начале и в конце рабочего дня. Парковку башни лучше уточнить заранее, чтобы не опоздать на выдачу.",
    },
  },
  "nisantasi-arac-kiralama": {
    en: {
      area: "Nişantaşı is the shopping, hotel and residential quarter between Teşvikiye and Maçka.",
      around: "Abdi İpekçi, the streets around Teşvikiye Camii and the Maçka hill are within a walk. Harbiye and Osmanbey connect from the same exits.",
      drive: "The streets are one-way and narrow. Hunting for a kerb space stretches the plan. It is easier to use a nearby car park and walk the shops.",
    },
    de: {
      area: "Nişantaşı ist das Viertel aus Läden, Hotels und Wohnungen zwischen Teşvikiye und Maçka.",
      around: "Abdi İpekçi, die Straßen um die Teşvikiye Camii und der Maçka-Hang liegen in Gehweite. Harbiye und Osmanbey hängen an denselben Ausfahrten.",
      drive: "Die Straßen sind eng und Einbahn. Lange nach einem Randplatz zu suchen zieht den Plan in die Länge. Ein nahes Parkhaus und zu Fuß durch die Läden ist einfacher.",
    },
    ar: {
      area: "نيشانتاشي حي التسوق والفنادق والمساكن بين تشفيكييه وماجكا.",
      around: "عبدي إيبكجي ومحيط جامع تشفيكييه ومنحدر ماجكا على مسافة مشي. هاربيه وعثمان بي يتصلان من المخارج نفسها.",
      drive: "الشوارع باتجاه واحد وضيقة. البحث الطويل عن مكان على الرصيف يطيل البرنامج. الأسهل موقف قريب ثم المشي في السوق.",
    },
    ru: {
      area: "Нишанташи — квартал магазинов, отелей и жилья между Тешвикие и Мачкой.",
      around: "Abdi İpekçi, улицы у Teşvikiye Camii и склон Мачки в пешей доступности. Харбие и Османбей выходят с тех же съездов.",
      drive: "Улицы узкие и односторонние. Долгий поиск места у обочины сдвигает план. Проще ближайшая парковка и пешком по магазинам.",
    },
  },
  "bebek-arac-kiralama": {
    en: {
      area: "Bebek is the Bosphorus cove in Beşiktaş and the steep residential streets around it.",
      around: "From Etiler you come down the Bebek hill. Along the shore the roads run through Arnavutköy and Rumelihisarı. The shore road gets heavy on weekend afternoons.",
      drive: "Parking around the cove is limited. Leave the car in a car park on the upper level and walk down. That also makes the one-way streets easier on the way back.",
    },
    de: {
      area: "Bebek ist die Bucht am Bosporus in Beşiktaş und die steilen Wohnstraßen darum.",
      around: "Von Etiler führt der Bebek-Hang hinunter, am Ufer die Linien durch Arnavutköy und Rumelihisarı. Die Uferstraße wird am Wochenende am Nachmittag schwer.",
      drive: "Rund um die Bucht gibt es wenig Parkplätze. Stellen Sie das Auto oben ins Parkhaus und gehen Sie hinunter. Die Einbahnstraßen sind so auf dem Rückweg leichter.",
    },
    ar: {
      area: "ببيك خليج على البوسفور في بشيكتاش والشوارع السكنية المنحدرة حوله.",
      around: "من إتيلر تنزلون منحدر ببيك، وعلى الشاطئ يمر الخط عبر أرنافوتكوي وروملي حصار. طريق الشاطئ يثقل بعد ظهر عطلة الأسبوع.",
      drive: "المواقف حول الخليج محدودة. اتركوا السيارة في موقف بالأعلى وانزلوا مشياً. شوارع الاتجاه الواحد أسهل هكذا في العودة.",
    },
    ru: {
      area: "Бебек — бухта Босфора в Бешикташе и крутые жилые улицы вокруг.",
      around: "Из Этилера спускаетесь по склону Бебека, вдоль берега — через Арнавуткёй и Румелихисар. Береговая дорога тяжёлая в выходные после полудня.",
      drive: "У бухты парковок мало. Оставьте машину на верхней парковке и спуститесь пешком. Так проще и односторонние улицы на обратном пути.",
    },
  },
  "florya-arac-kiralama": {
    en: {
      area: "Florya is the Bakırköy shore quarter, where the Sea of Marmara coast and the housing streets sit together.",
      around: "Yeşilköy, Ataköy and central Bakırköy are on the same shore line. It stays on the European side, so Istanbul Airport needs no bridge. Sabiha Gökçen is on the other side.",
      drive: "The shore road crowds up in summer and at weekends. If you have a flight, an inland route is more predictable than the shore.",
    },
    de: {
      area: "Florya ist das Uferviertel von Bakırköy, Küste des Marmarameers und Wohnstraßen zusammen.",
      around: "Yeşilköy, Ataköy und das Zentrum von Bakırköy liegen auf derselben Uferachse. Es bleibt auf der europäischen Seite, der Istanbul Airport braucht keine Brücke. Sabiha Gökçen liegt auf der anderen Seite.",
      drive: "Die Uferstraße wird im Sommer und am Wochenende voll. Bei einem Flug ist eine innere Route berechenbarer als das Ufer.",
    },
    ar: {
      area: "فلوريا حي ساحل باكركوي، حيث يلتقي شاطئ مرمرة بالأحياء السكنية.",
      around: "يشيل كوي وأتاكوي ومركز باكركوي على محور الشاطئ نفسه. الحي في الجانب الأوروبي، فمطار إسطنبول بلا جسر. صبيحة كوكجن في الجانب الآخر.",
      drive: "طريق الشاطئ يزدحم صيفاً وفي عطلة الأسبوع. إذا كانت لديكم رحلة، الطريق الداخلي أوضح من الشاطئ.",
    },
    ru: {
      area: "Флорья — береговой квартал Бакыркёя, где побережье Мраморного моря и жилые улицы рядом.",
      around: "Ешилькёй, Атакёй и центр Бакыркёя на одной береговой линии. Это европейская сторона, до аэропорта Стамбула мост не нужен. Сабиха Гёкчен на другой стороне.",
      drive: "Береговая дорога заполняется летом и в выходные. Если есть рейс, внутренний маршрут предсказуемее берега.",
    },
  },
  "gokturk-arac-kiralama": {
    en: {
      area: "Göktürk is the housing district in Eyüpsultan on the Kemerburgaz road, and it links to Istanbul Airport from the north of the European side.",
      around: "The Kemerburgaz forest, the Göktürk shops and the airport road split from the same exits. Istanbul Airport is the pickup with no bridge for this neighbourhood.",
      drive: "The estate gates are controlled. Agree the estate name and the gate before a handover or a visit. In the evening the airport direction can get busier.",
    },
    de: {
      area: "Göktürk ist das Wohngebiet in Eyüpsultan an der Kemerburgaz-Straße und verbindet sich von Norden der europäischen Seite mit dem Istanbul Airport.",
      around: "Der Kemerburgaz-Wald, die Läden von Göktürk und die Flughafenstraße teilen sich dieselben Ausfahrten. Der Istanbul Airport ist hier die Abholung ohne Brücke.",
      drive: "Die Tore der Anlagen sind kontrolliert. Klären Sie Name und Tor vor Übergabe oder Besuch. Abends kann die Richtung zum Flughafen voller werden.",
    },
    ar: {
      area: "غوكتورك منطقة سكن في أيوب سلطان على طريق كيمر بورغاز، ويتصل بمطار إسطنبول من شمال الجانب الأوروبي.",
      around: "غابة كيمر بورغاز وسوق غوكتورك وطريق المطار تتفرع من المخارج نفسها. مطار إسطنبول هو الاستلام بلا جسر لهذا الحي.",
      drive: "بوابات المجمعات مراقبة. حددوا اسم المجمع والبوابة قبل التسليم أو الزيارة. مساءً قد يزداد الزحام باتجاه المطار.",
    },
    ru: {
      area: "Гёктюрк — жилой район Эюпсултана на дороге Кемербургаз и связан с аэропортом Стамбула с севера европейской стороны.",
      around: "Лес Кемербургаз, рынок Гёктюрка и дорога в аэропорт расходятся с одних съездов. Для этого района выдача в аэропорту Стамбула без моста.",
      drive: "Въезды в посёлки контролируются. Имя посёлка и ворота лучше согласовать до выдачи или визита. Вечером поток в сторону аэропорта может вырасти.",
    },
  },
  "beyoglu-arac-kiralama": {
    en: {
      area: "Beyoğlu takes in Taksim, Galata and Karaköy. A large share of its streets is given over to people on foot.",
      around: "İstiklal Caddesi is a walking street. For Galata Kulesi, Karaköy and Tophane you drive close, then leave the car in a car park.",
      drive: "One-way streets and pedestrian axes make driving through the middle a poor idea. Use one of the car parks around the edge.",
    },
    de: {
      area: "Beyoğlu umfasst Taksim, Galata und Karaköy. Ein großer Teil der Straßen ist Fußgängern vorbehalten.",
      around: "Die İstiklal Caddesi ist eine Fußgängerstraße. Zu Galata Kulesi, Karaköy und Tophane fahren Sie nah heran und stellen das Auto ins Parkhaus.",
      drive: "Einbahnstraßen und Fußgängerachsen: durch die Mitte zu fahren ist ungünstig. Nutzen Sie eines der Parkhäuser am Rand.",
    },
    ar: {
      area: "بيوغلو يضم تقسيم وغلطة وكاراكوي، وجزء كبير من شوارعه للمشاة.",
      around: "شارع الاستقلال للمشاة. إلى برج غلطة وكاراكوي وطوب خانه تقتربون بالسيارة ثم تتركونها في موقف.",
      drive: "الاتجاه الواحد ومحاور المشاة يجعلان عبور الوسط غير مناسب. استخدموا أحد المواقف على الأطراف.",
    },
    ru: {
      area: "Бейоглу включает Таксим, Галату и Каракёй. Большая часть улиц отдана пешеходам.",
      around: "İstiklal Caddesi — пешеходная. К Galata Kulesi, Каракёю и Топхане подъезжаете близко и оставляете машину на парковке.",
      drive: "Односторонние улицы и пешеходные оси: ехать через центр неудобно. Лучше парковка по краю.",
    },
  },
  "besiktas-arac-kiralama": {
    en: {
      area: "Beşiktaş is the European-side centre where the shore, the market and Barbaros Bulvarı meet.",
      around: "Dolmabahçe, Ortaköy and Zincirlikuyu are different ends of the same district. If the day mixes the shore and the towers, a car cuts the ferry and metro changes.",
      drive: "Parking by the market and the pier is hard. Barbaros Bulvarı slows uphill on weekday evenings. Leave time on that road if you are heading back to a flight.",
    },
    de: {
      area: "Beşiktaş ist das Zentrum der europäischen Seite, wo Ufer, Markt und Barbaros Bulvarı zusammenkommen.",
      around: "Dolmabahçe, Ortaköy und Zincirlikuyu sind verschiedene Enden desselben Bezirks. Mischt der Tag Ufer und Türme, spart das Auto Fähre und Metro-Umstieg.",
      drive: "Am Markt und an der Anlegestelle ist Parken schwer. Der Barbaros Bulvarı wird an Werktagabenden bergauf langsam. Planen Sie Zeit, wenn Sie zu einem Flug zurückfahren.",
    },
    ar: {
      area: "بشيكتاش مركز الجانب الأوروبي حيث يلتقي الشاطئ والسوق وشارع بارباروس.",
      around: "دولمة بهجة وأورطاكوي وزينجيرليكويو أطراف الحي نفسه. إذا جمع اليوم الشاطئ والأبراج، السيارة تقلل تبديل العبارة والمترو.",
      drive: "الوقوف عند السوق والرصيف صعب. شارع بارباروس يبطؤ صعوداً مساء أيام الأسبوع. اتركوا وقتاً إذا عدتم إلى رحلة.",
    },
    ru: {
      area: "Бешикташ — центр европейской стороны, где сходятся берег, рынок и Barbaros Bulvarı.",
      around: "Долмабахче, Ортакёй и Зинджирликую — разные концы одного района. Если день смешивает берег и башни, машина сокращает паром и метро.",
      drive: "У рынка и пристани парковаться трудно. Barbaros Bulvarı вечером по будням медленный в гору. На обратном пути к рейсу заложите время.",
    },
  },
  "sisli-arac-kiralama": {
    en: {
      area: "Şişli is the business, hospital and shopping district that covers Mecidiyeköy, Osmanbey and Bomonti.",
      around: "Büyükdere Caddesi runs from Şişli up to Levent. Nişantaşı and Harbiye are inside the same district boundary.",
      drive: "The Mecidiyeköy junction can be full at any hour. For a hospital or a tower, learn the car-park floor and the exit gate beforehand.",
    },
    de: {
      area: "Şişli ist der Bezirk aus Büros, Krankenhäusern und Läden um Mecidiyeköy, Osmanbey und Bomonti.",
      around: "Die Büyükdere Caddesi führt von Şişli nach Levent. Nişantaşı und Harbiye liegen innerhalb derselben Grenze.",
      drive: "Der Knoten Mecidiyeköy kann zu jeder Stunde voll sein. Für Krankenhaus oder Turm klären Sie vorher Parkdeck und Ausfahrtstor.",
    },
    ar: {
      area: "شيشلي حي الأعمال والمستشفيات والأسواق ويضم مجيدية كوي وعثمان بي وبومونتي.",
      around: "شارع بيوك دره يصعد من شيشلي إلى ليفنت. نيشانتاشي وهاربيه داخل حدود الحي نفسها.",
      drive: "تقاطع مجيدية كوي قد يمتلئ في أي ساعة. لموعد في مستشفى أو برج اعرفوا طابق الموقف وبوابة الخروج مسبقاً.",
    },
    ru: {
      area: "Шишли — район офисов, больниц и магазинов: Меджидиекёй, Османбей и Бомонти.",
      around: "Büyükdere Caddesi идёт из Шишли в Левент. Нишанташи и Харбие внутри той же границы.",
      drive: "Развязка Меджидиекёй может быть полной в любой час. Для больницы или башни заранее узнайте этаж парковки и выездные ворота.",
    },
  },
  "bakirkoy-arac-kiralama": {
    en: {
      area: "Bakırköy is the Marmara-shore district where the market, the hospitals and the Ataköy–Florya line come together.",
      around: "Capacity, the shore road and the Ataköy marina are a short drive apart. Istanbul Airport is on the same side. Sabiha Gökçen needs a Bosphorus crossing.",
      drive: "The shore and the market streets are busy. For shopping or a hospital, an estate or mall car park is clearer than the kerb.",
    },
    de: {
      area: "Bakırköy ist der Bezirk an der Marmaraküste, wo Markt, Krankenhäuser und die Linie Ataköy–Florya zusammenkommen.",
      around: "Capacity, die Uferstraße und die Marina von Ataköy liegen eine kurze Fahrt auseinander. Der Istanbul Airport ist auf derselben Seite. Sabiha Gökçen braucht die Bosporusquerung.",
      drive: "Ufer und Marktstraßen sind voll. Für Einkauf oder Krankenhaus ist ein Parkhaus in der Anlage oder im Einkaufszentrum klarer als der Rand.",
    },
    ar: {
      area: "باكركوي قضاء على ساحل مرمرة يجمع السوق والمستشفيات وخط أتاكوي–فلوريا.",
      around: "كاباسيتي وطريق الشاطئ ومارينا أتاكوي على مسافة قصيرة. مطار إسطنبول في الجهة نفسها. صبيحة كوكجن يحتاج عبور البوسفور.",
      drive: "الشاطئ وشوارع السوق مزدحمة. للتسوق أو المستشفى موقف المجمع أو المركز أوضح من الرصيف.",
    },
    ru: {
      area: "Бакыркёй — район на берегу Мраморного моря: рынок, больницы и линия Атакёй–Флорья.",
      around: "Capacity, береговая дорога и марина Атакёя в короткой поездке. Аэропорт Стамбула на той же стороне. До Сабихи Гёкчен нужен переход через Босфор.",
      drive: "Берег и рыночные улицы загружены. Для магазина или больницы парковка комплекса или торгового центра яснее обочины.",
    },
  },
  "sariyer-arac-kiralama": {
    en: {
      area: "Sarıyer is the European shore of the Bosphorus from İstinye to Rumeli Feneri, and the gate to Belgrad Ormanı.",
      around: "İstinye, Tarabya, Yeniköy and Zekeriyaköy are in the same district. Maslak and Göktürk branch off the northern axis. Istanbul Airport is the pickup on the same side.",
      drive: "The shore road moves slowly on weekend afternoons. Estate roads in the forest and the northern neighbourhoods are narrow. On the way back, check the inland road as well as the shore.",
    },
    de: {
      area: "Sarıyer ist das europäische Bosporusufer von İstinye bis Rumeli Feneri und das Tor zum Belgrad Ormanı.",
      around: "İstinye, Tarabya, Yeniköy und Zekeriyaköy liegen im selben Bezirk. Maslak und Göktürk zweigen von der Nordachse ab. Der Istanbul Airport ist die Abholung auf derselben Seite.",
      drive: "Die Uferstraße kommt am Wochenende am Nachmittag langsam voran. An den Wald- und Nordvierteln sind die Anliegerstraßen eng. Auf dem Rückweg prüfen Sie auch die innere Straße, nicht nur das Ufer.",
    },
    ar: {
      area: "ساريير الساحل الأوروبي للبوسفور من إستينيه إلى روملي فنار، وباب غابة بلغراد.",
      around: "إستينيه وتارابيا ويني كوي وزكريا كوي في القضاء نفسه. ماسلاك وغوكتورك يتفرعان من المحور الشمالي. مطار إسطنبول هو الاستلام في الجهة نفسها.",
      drive: "طريق الشاطئ بطيء بعد ظهر العطلة. طرق المجمعات في الغابة والأحياء الشمالية ضيقة. في العودة راجعوا الطريق الداخلي مع الشاطئ.",
    },
    ru: {
      area: "Сарыер — европейский берег Босфора от Истинье до Румели Фенер и ворота Белградского леса.",
      around: "Истинье, Тарабья, Еникёй и Зекериякёй в одном районе. Маслак и Гёктюрк ответвляются с северной оси. Выдача — в аэропорту Стамбула на той же стороне.",
      drive: "Береговая дорога ползёт в выходные после полудня. Дороги посёлков у леса и на севере узкие. На обратном пути смотрите и внутреннюю дорогу, не только берег.",
    },
  },
  "caddebostan-arac-kiralama": {
    en: {
      area: "Caddebostan is the Kadıköy quarter where Bağdat Caddesi meets the Marmara shore.",
      around: "Suadiye, Erenköy and the Caddebostan shore are on the same line. It is on the Asian side, so Sabiha Gökçen needs no bridge.",
      drive: "Bağdat Caddesi slows in the evening and at weekends. Space on the shore is limited. Leave the car on a side street or in a car park and walk the avenue.",
    },
    de: {
      area: "Caddebostan ist das Viertel in Kadıköy, wo die Bağdat Caddesi auf das Marmaraufer trifft.",
      around: "Suadiye, Erenköy und das Ufer von Caddebostan liegen auf derselben Linie. Es ist die asiatische Seite, Sabiha Gökçen braucht keine Brücke.",
      drive: "Die Bağdat Caddesi wird abends und am Wochenende langsam. Am Ufer ist wenig Platz. Stellen Sie das Auto in eine Seitenstraße oder ein Parkhaus und gehen Sie die Allee zu Fuß.",
    },
    ar: {
      area: "جاديبوستان حي في قاضي كوي حيث يلتقي شارع بغداد بساحل مرمرة.",
      around: "سوادييه وإرنكوي وشاطئ جاديبوستان على الخط نفسه. الحي في الجانب الآسيوي، فصبيحة كوكجن بلا جسر.",
      drive: "شارع بغداد يبطؤ مساءً وفي العطلة. المكان على الشاطئ محدود. اتركوا السيارة في شارع جانبي أو موقف وامشوا الشارع.",
    },
    ru: {
      area: "Джаддебостан — квартал Кадыкёя, где Bağdat Caddesi встречается с берегом Мраморного моря.",
      around: "Суадие, Эренкёй и берег Джаддебостана на одной линии. Это азиатская сторона, до Сабихи Гёкчен мост не нужен.",
      drive: "Bağdat Caddesi замедляется вечером и в выходные. На берегу мест мало. Оставьте машину на боковой улице или парковке и пройдите проспект пешком.",
    },
  },
  "suadiye-arac-kiralama": {
    en: {
      area: "Suadiye is the shore quarter on Bağdat Caddesi, between Caddebostan and Bostancı.",
      around: "The shops, the shore and Bağdat Caddesi sit on top of each other. Kozyatağı and Bostancı are a short drive. Sabiha Gökçen is the pickup on the same side.",
      drive: "The avenue is slow because of the one-way flow and the people on foot. When you go down to the shore park, leaving the car on the upper level makes the return easier.",
    },
    de: {
      area: "Suadiye ist das Uferviertel an der Bağdat Caddesi, zwischen Caddebostan und Bostancı.",
      around: "Läden, Ufer und Bağdat Caddesi liegen ineinander. Kozyatağı und Bostancı sind eine kurze Fahrt. Sabiha Gökçen ist die Abholung auf derselben Seite.",
      drive: "Die Allee ist langsam durch die Einbahn und die Fußgänger. Wenn Sie zum Uferpark hinunterfahren, erleichtert ein Stellplatz weiter oben die Rückfahrt.",
    },
    ar: {
      area: "سوادييه حي ساحلي على شارع بغداد بين جاديبوستان وبوستانجي.",
      around: "السوق والشاطئ وشارع بغداد متداخلون. كوزياتاغي وبوستانجي على مسافة قصيرة. صبيحة كوكجن هو الاستلام في الجهة نفسها.",
      drive: "الشارع بطيء بسبب الاتجاه الواحد والمشاة. عند النزول إلى حديقة الشاطئ، ترك السيارة في الأعلى يسهّل العودة.",
    },
    ru: {
      area: "Суадие — береговой квартал на Bağdat Caddesi между Джаддебостаном и Бостанджи.",
      around: "Магазины, берег и проспект рядом. Козьятагы и Бостанджи — короткая поездка. Выдача в Сабихе Гёкчен на той же стороне.",
      drive: "Проспект медленный из-за одностороннего потока и пешеходов. Спускаясь к береговому парку, оставьте машину выше — так проще вернуться.",
    },
  },
  "bati-atasehir-arac-kiralama": {
    en: {
      area: "Batı Ataşehir is the part of Ataşehir where the towers, finance offices and housing blocks gather.",
      around: "Kozyatağı, İçerenköy and central Ataşehir stay inside the same district. Collecting at Sabiha Gökçen on a meeting day reaches the offices without a bridge to the European side.",
      drive: "At office hours the main boulevard and the estate exits fill up. A tower car park may need a guest registration. Ask before the appointment.",
    },
    de: {
      area: "Batı Ataşehir ist der Teil von Ataşehir, in dem Türme, Finanzbüros und Wohnblöcke zusammenliegen.",
      around: "Kozyatağı, İçerenköy und das Zentrum von Ataşehir bleiben im selben Bezirk. Die Abholung am Sabiha Gökçen an einem Termintag führt ins Büroviertel ohne Brücke zur europäischen Seite.",
      drive: "Zu Bürozeiten werden der Hauptboulevard und die Ausfahrten der Anlagen voll. Ein Parkhaus im Turm kann eine Gastanmeldung brauchen. Fragen Sie vor dem Termin.",
    },
    ar: {
      area: "باتي أتاشهير جزء أتاشهير الذي تجتمع فيه الأبراج ومكاتب المال والمجمعات السكنية.",
      around: "كوزياتاغي وإيتشرين كوي ومركز أتاشهير داخل القضاء نفسه. الاستلام من صبيحة كوكجن في يوم اجتماع يصل إلى منطقة العمل بلا جسر إلى الجانب الأوروبي.",
      drive: "في ساعات الدوام يمتلئ الشارع الرئيسي ومخارج المجمعات. موقف البرج قد يحتاج تسجيل ضيف. اسألوا قبل الموعد.",
    },
    ru: {
      area: "Баты Аташехир — часть Аташехира, где собраны башни, финансовые офисы и жилые блоки.",
      around: "Козьятагы, Ичеренкёй и центр Аташехира в одном районе. Выдача в Сабихе Гёкчен в день встречи выводит в деловой квартал без моста на европейскую сторону.",
      drive: "В рабочие часы бульвар и выезды посёлков заполнены. Парковка башни может требовать регистрацию гостя. Уточните до встречи.",
    },
  },
  "acarkent-arac-kiralama": {
    en: {
      area: "Acarkent is the housing district in the forest in Beykoz, on the north of the Asian side.",
      around: "Kavacık, the Beykoz shops and the TEM link split from the Acarkent exits. Sabiha Gökçen is on the same side. The distance runs north, and there is no bridge.",
      drive: "The estate roads slope, and the gates are controlled. Agree the gate name and the plate notice before handover. In the evening the forest road is lit more thinly than the main road.",
    },
    de: {
      area: "Acarkent ist das Wohngebiet im Wald von Beykoz, im Norden der asiatischen Seite.",
      around: "Kavacık, die Läden von Beykoz und die TEM-Anbindung zweigen von den Ausfahrten Acarkents ab. Sabiha Gökçen liegt auf derselben Seite. Die Strecke läuft nach Norden, ohne Brücke.",
      drive: "Die Anliegerstraßen sind geneigt, die Tore kontrolliert. Klären Sie Torname und Kennzeichenmeldung vor der Übergabe. Abends ist die Waldstraße schwächer beleuchtet als die Hauptstraße.",
    },
    ar: {
      area: "أجاركنت منطقة سكن داخل الغابة في بيكوز، شمال الجانب الآسيوي.",
      around: "كافاجيك وسوق بيكوز ووصلة TEM تتفرع من مخارج أجاركنت. صبيحة كوكجن في الجهة نفسها. المسافة تمتد شمالاً بلا جسر.",
      drive: "طرق المجمع منحدرة والبوابات مراقبة. حددوا اسم البوابة وإبلاغ اللوحة قبل التسليم. مساءً إضاءة طريق الغابة أضعف من الشارع الرئيسي.",
    },
    ru: {
      area: "Аджаркент — жилой район в лесу Бейкоза, на севере азиатской стороны.",
      around: "Каваджик, рынок Бейкоза и съезд на TEM расходятся с выездов Аджаркента. Сабиха Гёкчен на той же стороне. Путь уходит на север, мост не нужен.",
      drive: "Дороги посёлка с уклоном, въезды контролируются. Имя ворот и сообщение номера лучше согласовать до выдачи. Вечером лесная дорога освещена слабее главной.",
    },
  },
  "kandilli-arac-kiralama": {
    en: {
      area: "Kandilli is the steep quarter on the Üsküdar–Beykoz ridge, looking over the Bosphorus.",
      around: "The shore line of Çengelköy, Vaniköy and Kuzguncuk is on the lower level below Kandilli. It stays on the Asian side, so the pickup is Sabiha Gökçen.",
      drive: "The streets are narrow and steep. Taking a large car all the way to the estate gate can be difficult. Walking from a car park on the upper road is smoother.",
    },
    de: {
      area: "Kandilli ist das steile Viertel auf dem Rücken zwischen Üsküdar und Beykoz, mit Blick auf den Bosporus.",
      around: "Die Uferlinie von Çengelköy, Vaniköy und Kuzguncuk liegt unterhalb von Kandilli. Es bleibt die asiatische Seite, die Abholung ist Sabiha Gökçen.",
      drive: "Die Straßen sind eng und geneigt. Ein großes Auto bis zum Tor der Anlage zu fahren kann schwer sein. Vom Parkplatz an der oberen Straße zu gehen ist ruhiger.",
    },
    ar: {
      area: "كانديللي حي منحدر على حافة أسكدار–بيكوز ويطل على البوسفور.",
      around: "خط شاطئ تشنغل كوي وفاني كوي وكوزغونجوك في المنسوب الأسفل من كانديللي. الحي في الجانب الآسيوي، فالاستلام من صبيحة كوكجن.",
      drive: "الشوارع ضيقة ومنحدرة. إيصال سيارة كبيرة حتى بوابة المجمع قد يكون صعباً. المشي من موقف على الطريق الأعلى أسهل.",
    },
    ru: {
      area: "Кандилли — крутой квартал на хребте Ускюдар–Бейкоз с видом на Босфор.",
      around: "Берег Ченгелькёя, Ваникёя и Кузгунджука ниже Кандилли. Это азиатская сторона, выдача в Сабихе Гёкчен.",
      drive: "Улицы узкие и крутые. Довезти крупную машину до ворот посёлка бывает трудно. Спокойнее парковка на верхней дороге и пешком.",
    },
  },
  "pendik-arac-kiralama": {
    en: {
      area: "Pendik is the district where Sabiha Gökçen stands. The shore, Kaynarca and the Kurtköy axis are inside the same boundary.",
      around: "The airport, the central office and the Pendik shore are a short distance apart. If the flight lands here, collecting in the same district removes the Bosphorus crossing from the start.",
      drive: "The airport ring road fills at flight times. Leave separate time for the shore and the market. If you will return the car at SAW, leave for the terminal early.",
    },
    de: {
      area: "Pendik ist der Bezirk, in dem Sabiha Gökçen liegt. Ufer, Kaynarca und die Kurtköy-Achse bleiben in derselben Grenze.",
      around: "Flughafen, Zentralbüro und das Ufer von Pendik liegen nah beieinander. Landet der Flug hier, nimmt die Abholung im selben Bezirk die Bosporusquerung von Anfang an heraus.",
      drive: "Die Ringstraße am Flughafen wird zu Flugzeiten voll. Planen Sie extra Zeit für Ufer und Markt. Geben Sie das Auto an SAW zurück, fahren Sie früh zum Terminal.",
    },
    ar: {
      area: "بنديك القضاء الذي يقع فيه صبيحة كوكجن. الشاطئ وكاينارجا ومحور كورت كوي داخل الحد نفسه.",
      around: "المطار والمكتب المركزي وشاطئ بنديك على مسافة قصيرة. إذا هبطت الرحلة هنا، الاستلام في القضاء نفسه يلغي عبور البوسفور من البداية.",
      drive: "الطريق الدائري للمطار يزدحم في أوقات الرحلات. اتركوا وقتاً منفصلاً للشاطئ والسوق. إذا كانت الإعادة في SAW فاخرجوا إلى المبنى مبكراً.",
    },
    ru: {
      area: "Пендик — район, где стоит Сабиха Гёкчен. Берег, Кайнаржа и ось Курткёя внутри одной границы.",
      around: "Аэропорт, центральный офис и берег Пендика близко. Если рейс садится здесь, выдача в том же районе сразу убирает переход через Босфор.",
      drive: "Кольцо аэропорта заполняется к времени рейсов. На берег и рынок заложите отдельное время. Если возврат в SAW, выезжайте к терминалу раньше.",
    },
  },
  "kurtkoy-arac-kiralama": {
    en: {
      area: "Kurtköy is the housing and business area in Pendik, right around Sabiha Gökçen.",
      around: "The airport gates, the TEM link and the central office in Yenişehir are close to the Kurtköy exits. For a working day or a flight, SAW is the shortest pickup.",
      drive: "The roads around the airport slow at arrival and departure times. For a handover inside an estate, write the block and the gate in advance.",
    },
    de: {
      area: "Kurtköy ist das Wohn- und Geschäftsgebiet in Pendik, direkt um Sabiha Gökçen.",
      around: "Die Flughafentore, die TEM-Anbindung und das Zentralbüro in Yenişehir liegen nah an den Ausfahrten von Kurtköy. Für einen Arbeitstag oder einen Flug ist SAW die kürzeste Abholung.",
      drive: "Die Straßen um den Flughafen werden zu Ankunfts- und Abflugzeiten langsam. Für eine Übergabe in einer Anlage schreiben Sie Block und Tor vorher auf.",
    },
    ar: {
      area: "كورت كوي منطقة السكن والعمل في بنديك مباشرة حول صبيحة كوكجن.",
      around: "بوابات المطار ووصلة TEM والمكتب المركزي في يني شهير قريبة من مخارج كورت كوي. ليوم عمل أو رحلة، SAW أقصر نقطة استلام.",
      drive: "الطرق حول المطار تبطؤ في أوقات الوصول والمغادرة. لتسليم داخل مجمع اكتبوا البلوك والبوابة مسبقاً.",
    },
    ru: {
      area: "Курткёй — жилой и деловой район Пендика прямо вокруг Сабихи Гёкчен.",
      around: "Ворота аэропорта, съезд на TEM и центральный офис в Енишехире близко к выездам Курткёя. Для рабочего дня или рейса SAW — самая короткая выдача.",
      drive: "Дороги вокруг аэропорта замедляются в часы прилёта и вылета. Для выдачи внутри посёлка заранее запишите блок и ворота.",
    },
  },
  "kadikoy-arac-kiralama": {
    en: {
      area: "Kadıköy is the Asian-side centre that brings together the market, Moda and the pier.",
      around: "The Moda shore, Bahariye and the quay are walked. Bostancı, Caddebostan and Kozyatağı connect by car. Sabiha Gökçen is on the same side.",
      drive: "The market and the Moda streets are a poor place to drive around. Leave the car in a car park and walk. That saves time and the risk of a fine.",
    },
    de: {
      area: "Kadıköy ist das Zentrum der asiatischen Seite aus Markt, Moda und Anlegestelle.",
      around: "Das Ufer von Moda, Bahariye und der Kai werden zu Fuß gegangen. Bostancı, Caddebostan und Kozyatağı verbinden sich mit dem Auto. Sabiha Gökçen liegt auf derselben Seite.",
      drive: "Markt und die Straßen von Moda eignen sich schlecht zum Herumfahren. Stellen Sie das Auto ins Parkhaus und gehen Sie. Das spart Zeit und das Risiko eines Bußgeldes.",
    },
    ar: {
      area: "قاضي كوي مركز الجانب الآسيوي ويجمع السوق ومودا والرصيف.",
      around: "شاطئ مودا وبهارية والرصيف تُمشى. بوستانجي وجاديبوستان وكوزياتاغي تتصل بالسيارة. صبيحة كوكجن في الجهة نفسها.",
      drive: "السوق وشوارع مودا غير مناسبة للدوران بالسيارة. اتركوا السيارة في موقف وامشوا. هذا يوفر الوقت ويقلل خطر المخالفة.",
    },
    ru: {
      area: "Кадыкёй — центр азиатской стороны: рынок, Мода и пристань.",
      around: "Берег Моды, Бахарие и набережная — пешком. Бостанджи, Джаддебостан и Козьятагы связываются машиной. Сабиха Гёкчен на той же стороне.",
      drive: "Рынок и улицы Моды плохо подходят для езды. Оставьте машину на парковке и идите пешком. Так меньше времени и риска штрафа.",
    },
  },
  "uskudar-arac-kiralama": {
    en: {
      area: "Üsküdar is the district at the Asian entrance of the Bosphorus, with the shore, the market and the Marmaray stop.",
      around: "The view of Kız Kulesi, Kuzguncuk, Beylerbeyi and Altunizade are in the same district. A crossing to the European side, by bridge or Eurasia Tunnel, comes after this shore.",
      drive: "The shore and the pier area are timed parking. Car parks on the Altunizade side are easier than inside the market. If you will use the bridge, the car has HGS, and the toll is charged to you at the end of the rental.",
    },
    de: {
      area: "Üsküdar ist der Bezirk am asiatischen Eingang des Bosporus, mit Ufer, Markt und Marmaray-Halt.",
      around: "Der Blick auf Kız Kulesi, Kuzguncuk, Beylerbeyi und Altunizade liegen im selben Bezirk. Die Querung zur europäischen Seite, Brücke oder Eurasien-Tunnel, kommt nach diesem Ufer.",
      drive: "Ufer und Anlegestelle sind zeitlich beschränktes Parken. Parkhäuser auf der Altunizade-Seite sind leichter als im Markt. Fahren Sie auf die Brücke, hat das Auto HGS, die Maut wird am Ende der Miete Ihnen berechnet.",
    },
    ar: {
      area: "أسكدار القضاء عند المدخل الآسيوي للبوسفور، وفيه الشاطئ والسوق ومحطة مرمرة.",
      around: "منظر برج الفتاة وكوزغونجوك وبيلربي وألتونيزاده في القضاء نفسه. العبور إلى الجانب الأوروبي بالجسر أو نفق أوراسيا يأتي بعد هذا الشاطئ.",
      drive: "الشاطئ ومحيط الرصيف موقف بوقت. مواقف جهة ألتونيزاده أسهل من داخل السوق. إذا صعدتم الجسر فالسيارة فيها HGS، ورسوم العبور تُحسب عليكم في نهاية التأجير.",
    },
    ru: {
      area: "Ускюдар — район у азиатского входа на Босфор: берег, рынок и остановка Мармарай.",
      around: "Вид на Кыз Кулеси, Кузгунджук, Бейлербейи и Алтунизаде в одном районе. Переход на европейскую сторону, мост или Евразийский тоннель, начинается после этого берега.",
      drive: "Берег и пристань — парковка по времени. Парковки со стороны Алтунизаде проще, чем внутри рынка. Если поедете на мост, в машине есть HGS, и проезд спишут вам в конце аренды.",
    },
  },
  "maltepe-arac-kiralama": {
    en: {
      area: "Maltepe is the district between Kartal and Kadıköy, with the shore park and the housing neighbourhoods stretched along it.",
      around: "İdealtepe, Cevizli and the shore band are on the same line. Sabiha Gökçen is on the Asian side, so there is no bridge.",
      drive: "The shore road fills in the evening. The inland D-100 can be more predictable than the shore. On the way back to a flight, check both on the map.",
    },
    de: {
      area: "Maltepe ist der Bezirk zwischen Kartal und Kadıköy, mit Uferpark und den Wohnvierteln daran.",
      around: "İdealtepe, Cevizli und das Uferband liegen auf derselben Linie. Sabiha Gökçen ist auf der asiatischen Seite, eine Brücke entfällt.",
      drive: "Die Uferstraße wird am Abend voll. Die innere D-100 kann berechenbarer sein als das Ufer. Auf dem Rückweg zu einem Flug prüfen Sie beide auf der Karte.",
    },
    ar: {
      area: "مالتبه القضاء بين كارتال وقاضي كوي، وفيه حديقة الشاطئ والأحياء السكنية الممتدة.",
      around: "إيديل تبه وجفيزلي وشريط الشاطئ على الخط نفسه. صبيحة كوكجن في الجانب الآسيوي، بلا جسر.",
      drive: "طريق الشاطئ يمتلئ مساءً. محور D-100 الداخلي قد يكون أوضح من الشاطئ. في العودة إلى رحلة راجعوا الاثنين على الخريطة.",
    },
    ru: {
      area: "Мальтепе — район между Карталом и Кадыкёем: береговой парк и тянущиеся жилые кварталы.",
      around: "Идеалтепе, Джевизли и береговая полоса на одной линии. Сабиха Гёкчен на азиатской стороне, мост не нужен.",
      drive: "Береговая дорога заполняется вечером. Внутренняя D-100 бывает предсказуемее берега. На обратном пути к рейсу посмотрите оба варианта на карте.",
    },
  },
  "kartal-arac-kiralama": {
    en: {
      area: "Kartal is the southern district of the Asian side, between Maltepe and Pendik, with the shore and the neighbourhoods on the hill.",
      around: "Dragos, the shore and the hospital area connect inside the district. Sabiha Gökçen is on the Pendik boundary, next to Kartal.",
      drive: "Parking is limited on the shore and in the central market. The neighbourhoods on the hill slope. If the return is at SAW, check the airport road separately from the shore.",
    },
    de: {
      area: "Kartal ist der südliche Bezirk der asiatischen Seite, zwischen Maltepe und Pendik, mit Ufer und den Vierteln auf dem Hügel.",
      around: "Dragos, das Ufer und das Krankenhausgebiet verbinden sich innerhalb des Bezirks. Sabiha Gökçen liegt an der Grenze von Pendik, neben Kartal.",
      drive: "Am Ufer und im zentralen Markt ist Parken begrenzt. Die Viertel auf dem Hügel sind geneigt. Ist die Rückgabe an SAW, prüfen Sie die Flughafenstraße getrennt vom Ufer.",
    },
    ar: {
      area: "كارتال القضاء الجنوبي للجانب الآسيوي بين مالتبه وبنديك، وفيه الشاطئ وأحياء التلة.",
      around: "دراغوس والشاطئ ومنطقة المستشفى تتصل داخل القضاء. صبيحة كوكجن على حد بنديك، بجوار كارتال.",
      drive: "المواقف محدودة على الشاطئ وفي السوق المركزي. أحياء التلة منحدرة. إذا كانت الإعادة في SAW فراجعوا طريق المطار منفصلاً عن الشاطئ.",
    },
    ru: {
      area: "Картал — южный район азиатской стороны между Мальтепе и Пендиком: берег и кварталы на холме.",
      around: "Драгос, берег и больничный квартал связаны внутри района. Сабиха Гёкчен на границе Пендика, рядом с Карталом.",
      drive: "На берегу и в центральном рынке парковок мало. Кварталы на холме с уклоном. Если возврат в SAW, дорогу в аэропорт проверьте отдельно от берега.",
    },
  },
};
