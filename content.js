/**
 * ═══════════════════════════════════════════════════════════════
 *  திருமண நாள் கொண்டாட்டம் — முழு உள்ளடக்க கோப்பு
 *  அனைத்து வார்த்தைகள், பெயர்கள், தேதிகள், பாதைகள் இங்கிருந்தே திருத்தலாம்.
 * ═══════════════════════════════════════════════════════════════
 */

const CONTENT = {

  /* ── தம்பதியினர் விவரம் ─────────────────────────────────── */
  dadName:        "அமிர்தலிங்கம்",
  momName:        "ராஜகுமாரி",  
  weddingDate:    "செப்டம்பர் 12, 2004",
  anniversaryTag: "22 ஆம் ஆண்டு திருமண நாள்",
  kidsNames:      ["பிரவீன் குமார்", "பிரசன்னா குமார்"],

  /* ── முகப்புப் பகுதி ─────────────────────────────────────── */
  heroTitle:      "தங்கத்தில் பொறிக்கப்பட்ட காதல் 💛",
  heroSubtitle:   "எங்கள் அம்மா அப்பாவின் என்றும் மிளிரும் அன்பு",
  heroTagline:    "நேசமும், புன்னகையும், தியாகமும் நிறைந்த ஒரு வாழ்க்கைப் பயணம்",

  /* ── ஆசீர்வாதப் பகுதி ────────────────────────────────────── */
  blessingHeading: "ஆசீர்வாதம்",
  blessingText:   "இறைவனின் திருவருளுடன், காலத்தை வென்று நின்ற இந்த அன்பைக் கொண்டாடுகிறோம். இந்தப் புனிதப் பிணைப்பு, வரும் ஆண்டுகள் அனைத்திலும் மகிழ்ச்சியும், ஆரோக்கியமும், ஒற்றுமையும் நிறைந்து தழைக்கட்டும்.",
  blessingSubtext: "— ॐ ஸ்ரீ கணேசாய நமः —",

  /* ── எங்கள் கதை ──────────────────────────────────────────── */
  storyHeading:   "எங்கள் காதல் பயணம்",
  storyParagraphs: [
    "மதுரை மீனாட்சி அம்மன் கோவிலின் புனித நிழலில், இரு குடும்பங்கள் ஒன்றிணைந்த அந்த நாளில், பாரம்பரியமும் புன்னகையும் அன்புமாய் இணைந்த ஒரு பயணம் தொடங்கியது.",
    "பல ஆண்டுகளாக, பகிர்ந்த விடியல்களும், பண்டிகை கொண்டாட்டங்களும், அமைதியான மாலைப் பொழுதுகளும் இணைந்து, ஒரு சிறு வீட்டை ஆலயமாக மாற்றின — அன்பும் தியாகமும் பற்றுறுதியும் நிறைந்த இல்லமாக.",
    "இன்று, எங்களுக்கு அனைத்தையும் அளித்த அந்தப் பயணத்தை நாங்கள் நினைவு கூர்கிறோம் — மையினால் அல்ல, தங்கத்தினால் எழுதப்பட்ட ஒரு காதல் கதையை."
  ],

  /* ── மைல்கற்கள் காலவரிசை ─────────────────────────────────── */
  milestonesHeading: "மைல்கற்கள்",
  milestonesSubheading: "காலத்தின் வழியே ஒரு பயணம்",
milestones: [
  {
    year: 2004,
    title: "திருமணத்தின் புனித தொடக்கம்",
    caption: "மரபின் ஆசீர்வாதத்தில் தொடங்கிய இனிய இணைவு."
  },
  {
    year: 2005,
    title: "முதல் மகிழ்ச்சி",
    caption: "பிரவீன் குமார் வருகையால் குடும்பம் ஆனந்தத்தில் மலர்ந்தது."
  },
  {
    year: 2009,
    title: "இனிய நிறைவு",
    caption: "பிரசன்னா குமார் வருகையால் அன்பின் வட்டம் முழுமையானது."
  },
  {
    year: 2014,
    title: "பத்து ஆண்டுகளின் பாசம்",
    caption: "10 வருடங்கள் நிறைவடைந்தது."
  },
  {
    year: 2027,
    title: "புதிய தொடக்கங்கள்",
    caption: "புதிய வீடு, புதிய கனவுகள்… ஆனால் மாறாத அன்பு."
  },
 
],

  /* ── ஒப்பந்த விழா காட்சிப் பகுதி ──────────────────────────── */
  ceremonyCaption: "இரு இதயங்கள், ஒரே பயணம், 22 ஆண்டுகள் தொடர்கிறது.",

  /* ── புகைப்படத் தொகுப்பு ─────────────────────────────────── */
  galleryHeading: "இது தொடங்கிய இடம்",
  galleryImages: [
    { src: "images/wedding1.webp", caption: "திருமண நாள்" },
    { src: "images/wedding2.webp", caption: "இனிய தம்பதி" },
    { src: "images/wedding3.webp", caption: "புனித சபதம்" },
    { src: "images/wedding4.webp", caption: "குடும்பமும் மகிழ்ச்சியும்" },
    { src: "images/wedding5.webp", caption: "இணைந்த நடை" },
    { src: "images/wedding6.webp", caption: "பொன்னான நினைவுகள்" }
  ],

  /* ── குடும்பப் புகைப்படங்கள் (பேஸ் 11) ──────────────────── */
  familyPhotosHeading: "நினைவுத் தொகுப்பு",
  familyPhotos: [
    { src: "images/photo1.webp" },
    { src: "images/photo2.webp" },
    { src: "images/photo3.webp" },
    { src: "images/photo4.webp" },
    { src: "images/photo5.webp" },
    { src: "images/photo6.webp" },
    { src: "images/photo7.webp" },
    { src: "images/photo8.webp" },
    { src: "images/photo9.webp" },
    { src: "images/photo10.webp" }
  ],

  /* ── நிறைவு / சமர்ப்பணம் ─────────────────────────────────── */
  closingHeading: "எங்கள் அன்பு முழுவதும்",
  closingMessage: [
    "அம்மா & அப்பா — அன்பு என்றால் என்ன என்பதை நீங்கள் எங்களுக்குக் காட்டித் தந்தீர்கள். பெரிய சைகைகள் அல்ல, அமைதியான தியாகங்கள். குறையற்ற நாட்கள் அல்ல, அசைக்க முடியாத உங்கள் இருப்பு.",
    "30 ஆண்டுகளாக எங்கள் உலகைப் பிணைத்து வைத்ததற்கு, இது எங்கள் சிறிய நன்றிக் காணிக்கை.",
    "இன்னும் பல ஆண்டுகள் அன்பும், ஆரோக்கியமும், ஒற்றுமையும் நிறையட்டும். வார்த்தைகளுக்கு அப்பால் உங்களை நேசிக்கிறோம்."
  ],
  closingSignoff: "— அன்புடன், பிரவீன் குமார் & பிரசன்னா குமார்",

  /* ── படப் பாதைகள் ────────────────────────────────────────── */
  images: {
    heroBg:      "images/hero-bg.webp",
    parentsMain: "images/parents-main.web",
    wedding1:    "images/wedding1.webp",
    wedding2:    "images/wedding2.webp",
    wedding3:    "images/wedding3.webp",
    wedding4:    "images/wedding4.webp",
    wedding5:    "images/wedding5.webp",
    wedding6:    "images/wedding6.webp",
    photo1:      "images/photo1.webp",
    photo2:      "images/photo2.webp",
    photo3:      "images/photo3.webp",
    photo4:      "images/photo4.webp",
    photo5:      "images/photo5.webp",
    photo6:      "images/photo6.webp",
    photo7:      "images/photo7.webp",
    photo8:      "images/photo8.webp",
    photo9:      "images/photo9.webp",
    photo10:     "images/photo10.webp"
  },

  /* ── SVG வரைகலைப் பாதைகள் ───────────────────────────────── */
  svgs: {
    gopuram:        "assets/svg/gopuram.svg",
    borderTop:      "assets/svg/border-top.svg",
    borderBottom:   "assets/svg/border-bottom.svg",
    divider:        "assets/svg/divider.svg",
    photoFrame:     "assets/svg/photo-frame.svg",
    lotusCorner:    "assets/svg/lotus-corner.svg",
    kolam:          "assets/svg/kolam.svg",
    mandala:        "assets/svg/mandala.svg",
    templeArch:     "assets/svg/temple-arch.svg",
    diyas:          "assets/svg/diyas.svg"
  },

  /* ── இசை ─────────────────────────────────────────────────── */
  musicTrack:     "audio/background-music.mp3",
  musicLabel:     "♫ இசையை இயக்கு / நிறுத்து",

  /* ── பகுதி வழிசெலுத்தல் பெயர்கள் ─────────────────────────── */
  navSections: [
    { id: "hero",      label: "முகப்பு" },
    { id: "story",     label: "எங்கள் கதை" },
    { id: "timeline",  label: "மைல்கற்கள்" },
    { id: "gallery",   label: "நினைவுகள்" },
    { id: "closing",   label: "சமர்ப்பணம்" }
  ]
}