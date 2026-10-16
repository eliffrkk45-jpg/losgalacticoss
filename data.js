export const GRADES = [
  { id: 9,  title: "9. Sınıf",  emoji: "🧫", desc: "Hücre, ATP ve hücresel solunum", color: "g1", units: ["u9a", "u9b", "u9c"] },
  { id: 10, title: "10. Sınıf", emoji: "🧠", desc: "Beyin, omurilik ve yapı-görev ilişkisi", color: "g2", units: ["u10a"] },
  { id: 11, title: "11. Sınıf", emoji: "⚡", desc: "Reseptör, nöron, zar potansiyeli, impuls, glia", color: "g3", units: ["u11a", "u11b", "u11c", "u11d", "u11e"] }
];

const SK_CELL = [
  ["nucle|çekirdek|nükle", "Çekirdek", "Hücrenin yönetim merkezidir; kalıtım maddesini (DNA) taşır."],
  ["mitochon|mitokon", "Mitokondri", "Oksijenli solunumla ATP üretilen organeldir; hücrenin enerji santralidir."],
  ["golgi", "Golgi cisimciği", "Maddeleri paketleyip değiştirir, salgı keseciklerini oluşturur."],
  ["endoplas|reticul|retikul", "Endoplazmik retikulum", "Madde taşınmasını sağlar. Ribozomlu olanı protein sentezine yardım eder."],
  ["ribos", "Ribozom", "Protein sentezinin yapıldığı küçük yapılardır."],
  ["lyso|lizo", "Lizozom", "Sindirim enzimleriyle hücre içi sindirim yapar."],
  ["membran|zar", "Hücre zarı", "Seçici geçirgendir; hücreye madde giriş çıkışını denetler."],
  ["centri|sentr", "Sentrozom", "Hücre bölünmesinde iğ ipliklerinin oluşumunda görev alır."],
  ["cytop|sitop", "Sitoplazma", "Organelleri çevreleyen sıvıdır; glikoliz burada olur."]
];
const SK_NEURON = [
  ["dendr", "Dendrit", "Uyarıyı alıp hücre gövdesine taşıyan kısa ve dallı uzantılardır."],
  ["axon|akson", "Akson", "İmpulsu hücre gövdesinden uzaklaştıran uzun uzantıdır."],
  ["myelin|miyelin", "Miyelin kılıf", "Aksonu yalıtır, impuls iletimini hızlandırır."],
  ["node|ranvier", "Ranvier boğumu", "Miyelinin kesildiği yerdir; impuls burada sıçrayarak ilerler."],
  ["soma|cell body|body|gövde", "Hücre gövdesi", "Çekirdek ve organelleri taşır; uyarıların toplandığı bölgedir."],
  ["nucle|çekirdek", "Çekirdek", "Nöronun genetik bilgisini taşır."],
  ["terminal|synap|sinap|end", "Akson ucu", "Nörotransmitter salgılayarak diğer hücreye impuls aktarır."],
  ["schwann", "Schwann hücresi", "Periferik sinir sisteminde miyelin kılıfı oluşturur."]
];

export const UNITS = {
  u9a: {
    id: "u9a", grade: 9, title: "Hücre Yapısı ve Zar", emoji: "🧫",
    goal: "Nöronun yapısını ve zarındaki değişimleri anlamak",
    models: [{ id: "cell", label: "Hayvan Hücresi", build: "cell",
      intro: "Bir hayvan hücresini içinden keşfet! Organellere ve zarın üzerindeki proteinlere dokun. Nöron da böyle bir hücredir; zarındaki değişimler impulsun temelidir." }],
    sketch: { uid: "d72bcef869ef44338bdc589afb79d79e", label: "Ayrıntılı Hücre", keys: SK_CELL },
    match: [["Çekirdek", "Genetik bilgi merkezi"], ["Mitokondri", "ATP üretimi"], ["Ribozom", "Protein sentezi"], ["Lizozom", "Hücre içi sindirim"], ["Hücre zarı", "Seçici geçirgenlik"]],
    quiz: [
      { q: "Hücre zarının temel görevi hangisidir?", o: ["Protein sentezlemek", "Madde geçişini denetlemek", "ATP üretmek", "Kalıtım bilgisini saklamak"], a: 1, why: "Seçici geçirgen zar, maddelerin hücreye giriş çıkışını denetler." },
      { q: "Hücre zarının yapısını açıklayan model hangisidir?", o: ["Akıcı mozaik model", "Operon modeli", "Atom modeli", "Sürgülü iplik modeli"], a: 0, why: "Zar, hareketli fosfolipitler ve aralarına gömülü proteinlerden oluşur: akıcı mozaik model." },
      { q: "Hücrede ATP üretiminin büyük bölümü hangi organelde olur?", o: ["Ribozom", "Golgi", "Mitokondri", "Lizozom"], a: 2, why: "Oksijenli solunumun büyük kısmı mitokondride gerçekleşir." },
      { q: "Enerji harcanmadan gerçekleşen madde geçişi hangisidir?", o: ["Aktif taşıma", "Basit difüzyon", "Endositoz", "Na⁺/K⁺ pompası"], a: 1, why: "Basit difüzyon çok yoğun ortamdan az yoğun ortama olur ve ATP gerektirmez." },
      { q: "Nöronda proteinlerin sentezlendiği yapı hangisidir?", o: ["Ribozom", "Sentrozom", "Lizozom", "Hücre zarı"], a: 0, why: "Proteinler ribozomlarda sentezlenir." }
    ]
  },
  u9b: {
    id: "u9b", grade: 9, title: "ATP ve Hücresel Enerji", emoji: "🔋",
    goal: "Nöronların enerji gerektiren faaliyetlerini anlamak",
    models: [{ id: "atp", label: "ATP Molekülü", build: "atp",
      intro: "ATP; adenin, riboz ve üç fosfattan oluşur. Parçalara dokun, sonra aşağıdaki düğmelerle ATP'yi yık ve yeniden oluştur.",
      controls: [
        { label: "⚡ ATP → ADP + Pi", fn: "setState", arg: "hidroliz", text: "Son fosfat bağı koparken enerji açığa çıkar. Nöronda bu enerji Na⁺/K⁺ pompasını çalıştırır." },
        { label: "🔁 ADP + Pi → ATP", fn: "setState", arg: "sentez", text: "ADP ve fosfattan ATP yapılması enerji gerektirir. Bu enerji besinlerin yıkımından (solunum) gelir." }] }],
    quiz: [
      { q: "ATP'nin açılımı nedir?", o: ["Adenin timin protein", "Adenozin trifosfat", "Aktif taşıma proteini", "Amino trifosfat"], a: 1, why: "ATP: adenozin trifosfat. Adenin, riboz ve üç fosfattan oluşur." },
      { q: "ATP'den enerji nasıl açığa çıkar?", o: ["Adenin ayrılınca", "Son fosfat bağı kopunca", "Riboz yıkılınca", "Su eklenmeden"], a: 1, why: "Son fosfat bağı hidrolizle kopar, enerji açığa çıkar ve ADP ile Pi oluşur." },
      { q: "Aşağıdakilerden hangisi nöronda ATP gerektirir?", o: ["Basit difüzyon", "Na⁺/K⁺ pompasının çalışması", "Suyun osmozu", "Oksijenin difüzyonu"], a: 1, why: "Pompa, iyonları aktif taşımayla zıt yönde taşır ve ATP harcar." },
      { q: "ATP yıkıldığında hangi ürünler oluşur?", o: ["ADP ve inorganik fosfat", "AMP ve glikoz", "DNA ve RNA", "NADH ve oksijen"], a: 0, why: "ATP → ADP + Pi + enerji." },
      { q: "ATP neden 'hücrenin enerji parası' denir?", o: ["Sadece nöronda bulunur", "Enerji gerektiren işlerde ortak kullanılır ve sürekli yenilenir", "Depolanıp hiç harcanmaz", "Yalnızca kasta bulunur"], a: 1, why: "Hücre, enerji isteyen her işte ATP kullanır ve onu sürekli yeniden üretir." }
    ]
  },
  u9c: {
    id: "u9c", grade: 9, title: "Hücresel Solunum", emoji: "🫁",
    goal: "Sinir hücrelerinin enerji ihtiyacını kavramak",
    models: [{ id: "mito", label: "Mitokondri", build: "mito",
      intro: "Mitokondrinin içine bak: dış zar, iç zar kıvrımları (krista) ve matriks. ATP sentaz moleküllerine dokun!" }],
    match: [["Glikoliz", "Sitoplazma"], ["Krebs döngüsü", "Matriks"], ["Elektron taşıma sistemi", "Krista (iç zar)"], ["Son elektron alıcısı", "Oksijen"]],
    quiz: [
      { q: "Glikoliz hücrenin neresinde gerçekleşir?", o: ["Mitokondri matriksi", "Sitoplazma", "Çekirdek", "Krista"], a: 1, why: "Glikoliz sitoplazmada olur; oksijen gerektirmez." },
      { q: "Oksijenli solunumda son elektron alıcısı hangisidir?", o: ["Karbondioksit", "Glikoz", "Oksijen", "ATP"], a: 2, why: "Elektronlar elektron taşıma sisteminin sonunda oksijene aktarılır ve su oluşur." },
      { q: "Oksijenli solunumda en çok ATP hangi aşamada üretilir?", o: ["Glikoliz", "Elektron taşıma sistemi", "Fermantasyon", "Laktik asit oluşumu"], a: 1, why: "ATP'nin çoğu kristalardaki elektron taşıma sistemi ve ATP sentazla üretilir." },
      { q: "Beyin neden sürekli oksijene ihtiyaç duyar?", o: ["Nöronlar enerjiyi büyük ölçüde oksijenli solunumla üretir ve çok ATP harcar", "Nöronlar hiç ATP kullanmaz", "Oksijen impulsun kendisidir", "Beyinde mitokondri yoktur"], a: 0, why: "Nöronların ATP ihtiyacı yüksektir; ATP büyük ölçüde oksijenli solunumla sağlanır." },
      { q: "Oksijenli solunumun son ürünleri hangileridir?", o: ["CO₂, H₂O ve ATP", "Laktik asit ve ATP", "Etil alkol ve CO₂", "Glikoz ve O₂"], a: 0, why: "Glikoz oksijenle yıkılır: CO₂ + H₂O + ATP." }
    ]
  },
  u10a: {
    id: "u10a", grade: 10, title: "Canlılarda Yapı-Görev İlişkisi", emoji: "🧠",
    goal: "Beyin, omurilik ve nöronların görevlerini ilişkilendirmek",
    models: [
      { id: "brain", label: "🧠 Beyin", build: "brain", explode: true,
        intro: "Beynin loblarına, beyincik ve beyin sapına dokun. 'Parçala' düğmesiyle bölümleri birbirinden ayır!" },
      { id: "spinal", label: "🦴 Omurilik kesiti", build: "spinal",
        intro: "Omuriliğin enine kesitini incele: kelebek şeklindeki gri madde, beyaz madde, kökler ve zarlar." },
      { id: "motor10", label: "⚡ Motor nöron", build: "neuron", arg: "motor",
        intro: "Nöronun yapısı görevine uygundur: dallı dendritler uyarı alır, uzun akson iletir." }
    ],
    match: [["Beyincik", "Denge ve koordinasyon"], ["Omurilik soğanı", "Kalp atışı ve solunum"], ["Ön lob", "Düşünme ve planlama"], ["Dorsal kök", "Duyu bilgisi omuriliğe girer"], ["Ventral kök", "Motor emir omurilikten çıkar"]],
    quiz: [
      { q: "Merkezi sinir sistemini hangi yapılar oluşturur?", o: ["Beyin ve omurilik", "Beyin ve sinirler", "Omurilik ve kaslar", "Duyu organları"], a: 0, why: "Merkezi sinir sistemi (MSS) beyin ve omurilikten oluşur." },
      { q: "Basit bir refleksin merkezi neresidir?", o: ["Beyincik", "Omurilik", "Ön lob", "Pons"], a: 1, why: "Birçok refleks beyne gitmeden omurilikte işlenir; bu yüzden çok hızlıdır." },
      { q: "Denge ve kas koordinasyonunu hangi yapı sağlar?", o: ["Beyincik", "Oksipital lob", "Omurilik soğanı", "Dura mater"], a: 0, why: "Beyincik hareketlerin düzgün ve dengeli olmasını sağlar." },
      { q: "Kalp atışı ve solunum gibi yaşamsal işlevleri hangi bölüm yönetir?", o: ["Ön lob", "Omurilik soğanı", "Beyincik", "Şakak lobu"], a: 1, why: "Omurilik soğanı beyin sapında yer alır ve yaşamsal refleksleri düzenler." },
      { q: "Dendritlerin çok sayıda ve dallı olması hangi göreve uygundur?", o: ["Uyarı alma yüzeyini artırmak", "İmpuls hızını azaltmak", "ATP depolamak", "Miyelin yapmak"], a: 0, why: "Yüzey genişledikçe daha fazla uyarı alınır: yapı-görev ilişkisi." },
      { q: "Omurilikte hücre gövdelerinin bulunduğu kelebek şeklindeki bölge hangisidir?", o: ["Beyaz madde", "Gri madde", "Dura mater", "Spinal sinir"], a: 1, why: "Gri madde hücre gövdeleri ve ara nöronları içerir. Beyaz madde miyelinli aksonlardan oluşur." }
    ]
  },
  u11a: {
    id: "u11a", grade: 11, title: "Reseptör Çeşitleri", emoji: "👁️",
    goal: "Duyu reseptörlerini uyarıcılarına göre sınıflandırmak",
    models: [{ id: "rec", label: "Reseptörler", build: "receptors",
      intro: "Beş platformu gez: kemoreseptör, mekanoreseptör, termoreseptör, ağrı reseptörü ve fotoreseptör. Her modele dokun!" }],
    match: [["Fotoreseptör", "Işık"], ["Kemoreseptör", "Kimyasal madde (koku, tat)"], ["Mekanoreseptör", "Dokunma, basınç, titreşim"], ["Termoreseptör", "Sıcaklık değişimi"], ["Ağrı reseptörü", "Doku hasarı"]],
    quiz: [
      { q: "Işık uyarısını algılayan reseptör hangisidir?", o: ["Kemoreseptör", "Fotoreseptör", "Termoreseptör", "Mekanoreseptör"], a: 1, why: "Gözün retinasındaki koni ve çomaklar fotoreseptördür." },
      { q: "Dokunma, basınç ve titreşimi hangi reseptör algılar?", o: ["Mekanoreseptör", "Kemoreseptör", "Fotoreseptör", "Termoreseptör"], a: 0, why: "Mekanoreseptörler mekanik uyarılara karşı duyarlıdır (örn. Pacini cisimciği)." },
      { q: "Koku ve tat alma hangi reseptörlerle gerçekleşir?", o: ["Termoreseptör", "Fotoreseptör", "Kemoreseptör", "Mekanoreseptör"], a: 2, why: "Kemoreseptörler çözünmüş kimyasal maddelerle uyarılır." },
      { q: "Sıcaklık değişimini hangi reseptör algılar?", o: ["Termoreseptör", "Fotoreseptör", "Ağrı reseptörü", "Kemoreseptör"], a: 0, why: "Termoreseptörler sıcak ve soğuk uyarısını algılar." },
      { q: "Doku hasarı yapabilecek uyarıları hangi reseptör algılar?", o: ["Fotoreseptör", "Mekanoreseptör", "Ağrı reseptörü (serbest sinir ucu)", "Kemoreseptör"], a: 2, why: "Ağrı reseptörleri serbest sinir uçlarıdır ve zararlı uyarıları algılar." },
      { q: "Reseptörlerin ortak görevi nedir?", o: ["Uyarıyı impulsa çevirmek", "Miyelin yapmak", "ATP depolamak", "Kasları kasmak"], a: 0, why: "Reseptörler uyarıyı elektriksel sinyale (impuls) dönüştürür." }
    ]
  },
  u11b: {
    id: "u11b", grade: 11, title: "Nöronun Yapısı", emoji: "🔬",
    goal: "Nöron çeşitlerini yapı ve görev yönünden ayırt etmek",
    models: [
      { id: "n-my", label: "Miyelinli", build: "neuron", arg: "myelinated", intro: "Miyelinli nöron: akson miyelin kılıfla sarılıdır; Ranvier boğumları arasında impuls sıçrayarak hızlı iletilir." },
      { id: "n-un", label: "Miyelinsiz", build: "neuron", arg: "unmyelinated", intro: "Miyelinsiz nöron: aksonda miyelin yoktur, impuls kesintisiz ve daha yavaş iletilir." },
      { id: "n-se", label: "Duyu nöronu", build: "neuron", arg: "sensory", intro: "Duyu nöronu: impulsu reseptörden merkezi sinir sistemine taşır." },
      { id: "n-in", label: "Ara nöron", build: "neuron", arg: "inter", intro: "Ara nöron: merkezi sinir sisteminde duyu ve motor nöronları bağlar; çok dallı, kısa uzantılıdır." },
      { id: "n-mo", label: "Motor nöron", build: "neuron", arg: "motor", intro: "Motor nöron: impulsu merkezi sinir sisteminden efektöre (kas veya bez) taşır." }
    ],
    sketch: { uid: "be679731525c457cb01036fcf25afc37", label: "Ayrıntılı Nöron", keys: SK_NEURON },
    match: [["Duyu nöronu", "Reseptörden merkeze impuls"], ["Ara nöron", "MSS içinde bağlantı kurar"], ["Motor nöron", "Merkezden efektöre impuls"], ["Miyelinli nöron", "Sıçramalı, hızlı iletim"], ["Miyelinsiz nöron", "Kesintisiz, yavaş iletim"]],
    quiz: [
      { q: "Dendritin görevi nedir?", o: ["Uyarıyı hücre gövdesine taşımak", "İmpulsu kasa iletmek", "Miyelin yapmak", "ATP üretmek"], a: 0, why: "Dendritler uyarıyı alıp hücre gövdesine taşır." },
      { q: "Akson ne yapar?", o: ["Uyarı alır", "İmpulsu hücre gövdesinden uzaklaştırır", "Protein sentezler", "Savunma yapar"], a: 1, why: "Akson impulsu hücre gövdesinden diğer hücrelere iletir." },
      { q: "Miyelin kılıf nöronda neyi sağlar?", o: ["Yalıtım ve hızlı iletim", "Uyarı alma", "Protein sentezi", "Enerji depolama"], a: 0, why: "Miyelin yalıtım yapar; impuls Ranvier boğumlarında sıçrayarak iletilir." },
      { q: "Duyu nöronu impulsu nereden nereye taşır?", o: ["Merkezden efektöre", "Reseptörden merkezi sinir sistemine", "Kastan reseptöre", "Beyinden omuriliğe"], a: 1, why: "Duyu (afferent) nöronlar reseptörlerden MSS'ye impuls taşır." },
      { q: "Ara nöronlar nerede bulunur ve ne yapar?", o: ["Kasta; kasılma sağlar", "MSS içinde; nöronlar arası bağlantı kurar", "Deride; ağrı algılar", "Gözde; ışık algılar"], a: 1, why: "Ara nöronlar MSS içinde duyu ve motor nöronları bağlar." },
      { q: "Motor nöronun ucu hangi yapıya impuls iletir?", o: ["Reseptöre", "Efektöre (kas veya bez)", "Duyu organına", "Sadece beyne"], a: 1, why: "Motor nöronlar MSS'den efektörlere emir taşır." },
      { q: "Miyelinsiz aksonda impuls iletimi nasıl olur?", o: ["Sıçramalı ve hızlı", "Kesintisiz ve daha yavaş", "İletim olmaz", "Sadece geri yönde"], a: 1, why: "Miyelinsiz aksonda impuls zar boyunca kesintisiz ilerler; sıçramalı iletime göre yavaştır." }
    ]
  },
  u11c: {
    id: "u11c", grade: 11, title: "Zar Potansiyeli", emoji: "🔋",
    goal: "Polarizasyon, depolarizasyon ve repolarizasyonu kavramak",
    models: [{ id: "mem", label: "Nöron Zarı", build: "membrane",
      intro: "Mavi toplar Na⁺, yeşil toplar K⁺ iyonlarıdır. Soldaki göstergeden zar potansiyelini izle. Aşağıdaki düğmelerle evreleri sırayla oynat!",
      controls: [
        { label: "1) Polarizasyon", fn: "setState", arg: "rest", text: "Dinlenme hâlinde dışta Na⁺, içte K⁺ yoğundur. Zarın içi dışına göre negatiftir (yaklaşık −70 mV). Na⁺/K⁺ pompası ATP harcayarak bu dağılımı korur." },
        { label: "2) Depolarizasyon", fn: "setState", arg: "depol", text: "Eşik değer aşılınca Na⁺ kanalları açılır, Na⁺ hücre içine girer. Zarın içi pozitifleşir (yaklaşık +30 mV)." },
        { label: "3) Repolarizasyon", fn: "setState", arg: "repol", text: "Na⁺ kanalları kapanır, K⁺ kanalları açılır. K⁺ dışarı çıkar ve zarın içi yeniden negatifleşir. Sonra pompa iyon dağılımını eski hâline getirir." }] }],
    quiz: [
      { q: "Dinlenme potansiyelinde zarın iç yüzü nasıldır?", o: ["Dışa göre negatiftir (yaklaşık −70 mV)", "Dışa göre pozitiftir", "Yüksüzdür", "Yalnızca Na⁺ doludur"], a: 0, why: "Dinlenmede zarın içi dışına göre negatiftir: polarizasyon." },
      { q: "Dinlenme hâlinde iyon dağılımı nasıldır?", o: ["Dışta Na⁺, içte K⁺ yoğun", "Dışta K⁺, içte Na⁺ yoğun", "Hepsi eşit", "İçte yalnızca Cl⁻"], a: 0, why: "Na⁺ dışarıda, K⁺ içeridedir; bunu pompa korur." },
      { q: "Depolarizasyonda ne olur?", o: ["K⁺ dışarı çıkar", "Na⁺ kanalları açılır, Na⁺ içeri girer", "Pompa durur", "Zar yırtılır"], a: 1, why: "Na⁺ girişiyle zarın içi pozitifleşir." },
      { q: "Repolarizasyonda hangi iyon hareketi başlıca rol oynar?", o: ["Na⁺ girişi", "K⁺ çıkışı", "Ca²⁺ girişi", "Cl⁻ çıkışı"], a: 1, why: "K⁺ kanalları açılır, K⁺ dışarı çıkar ve zarın içi tekrar negatifleşir." },
      { q: "Na⁺/K⁺ pompası ne yapar?", o: ["3 Na⁺ dışarı, 2 K⁺ içeri taşır (ATP harcar)", "3 K⁺ dışarı, 2 Na⁺ içeri taşır", "ATP üretir", "Su taşır"], a: 0, why: "Pompa aktif taşıma yapar: 3 Na⁺ dışarı, 2 K⁺ içeri." },
      { q: "Eşik değerine ulaşan uyarıda impuls nasıl oluşur?", o: ["Her zaman yarım güçte", "Ya hep ya hiç yasasına göre aynı şiddette", "Hiç oluşmaz", "Uyarı şiddetiyle orantılı büyür"], a: 1, why: "Eşik aşılınca impuls tam olarak oluşur; eşik altı uyarıda hiç oluşmaz." }
    ]
  },
  u11d: {
    id: "u11d", grade: 11, title: "İmpuls İletimi", emoji: "⚡",
    goal: "Nöronda ve sinapsta impuls iletimini karşılaştırmak",
    models: [
      { id: "imp-m", label: "Miyelinli akson", build: "impulse", arg: true,
        intro: "İmpuls, miyelinli aksonda Ranvier boğumları arasında sıçrar. 'İmpulsu başlat' düğmesine bas!",
        controls: [{ label: "⚡ İmpulsu başlat", fn: "fire", text: "İmpuls aksonda ilerliyor..." }] },
      { id: "imp-u", label: "Miyelinsiz akson", build: "impulse", arg: false,
        intro: "Miyelinsiz aksonda impuls zar boyunca kesintisiz ilerler. Süreyi miyelinliyle karşılaştır!",
        controls: [{ label: "⚡ İmpulsu başlat", fn: "fire", text: "İmpuls aksonda ilerliyor..." }] },
      { id: "syn", label: "Sinaps", build: "synapse",
        intro: "Sinapsta iletim kimyasaldır ve tek yönlüdür. Başlat'a bas; Ca²⁺ girişini, kesecikleri ve nörotransmitterleri izle.",
        controls: [{ label: "▶ Sinapsı başlat", fn: "fire", text: "İmpuls akson ucuna ulaştı..." }, { label: "↺ Sıfırla", fn: "reset", text: "Sinaps başlangıç durumuna döndü." }] }
    ],
    quiz: [
      { q: "Sıçramalı iletim nerede görülür?", o: ["Miyelinsiz aksonda", "Miyelinli aksonda Ranvier boğumlarında", "Dendritte", "Reseptörde"], a: 1, why: "Miyelinli aksonda impuls yalnızca Ranvier boğumlarında yenilenir." },
      { q: "Sinaptik aralığa salınan kimyasal madde nedir?", o: ["Hormon", "Nörotransmitter", "Enzim", "Miyelin"], a: 1, why: "Nörotransmitter (örn. asetilkolin) sinaptik aralığa salınır." },
      { q: "Kesecikler akson ucunda zarla kaynaşıp içeriğini boşaltırken hangi iyonun girişi gerekir?", o: ["Ca²⁺", "Cl⁻", "Fe²⁺", "Mg²⁺"], a: 0, why: "Ca²⁺ girişi kesecik kaynaşmasını ve nörotransmitter salınımını başlatır." },
      { q: "Sinapsta iletim neden tek yönlüdür?", o: ["Her iki zarda da kesecik vardır", "Kesecikler yalnızca presinaptik uçta, reseptörler postsinaptik zarda bulunur", "Sinaptik aralık yoktur", "Impuls geri dönemez çünkü miyelin vardır"], a: 1, why: "Nörotransmitter yalnızca akson ucundan salınır, reseptörler yalnızca karşı zardadır." },
      { q: "Miyelinsiz aksonda iletim nasıldır?", o: ["Sıçramalı", "Kesintisiz ve daha yavaş", "İletim olmaz", "Kimyasal"], a: 1, why: "İmpuls zar boyunca adım adım kesintisiz ilerler." },
      { q: "Nörotransmitter postsinaptik zarda neye bağlanır?", o: ["Reseptöre", "Miyelin kılıfa", "Mitokondriye", "Ribozoma"], a: 0, why: "Reseptöre bağlanınca iyon kanalları açılır ve yeni impuls oluşabilir." }
    ]
  },
  u11e: {
    id: "u11e", grade: 11, title: "Nörona Yardımcı Hücreler: Glia", emoji: "🛡️",
    goal: "Glia hücrelerinin görevlerini ayırt etmek",
    models: [{ id: "glia", label: "Glia Hücreleri", build: "glia",
      intro: "Üstte merkezi, altta periferik sinir sistemi var. Oligodendrosit, Schwann hücresi ve mikroglia hücrelerine dokun!" }],
    match: [["Mikroglia", "Savunma, fagositoz
