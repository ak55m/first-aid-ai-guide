
export interface FirstAidGuidance {
  id: string;
  title: string;
  keywords: string[];
  steps: string[];
  dos: string[];
  donts: string[];
  medications?: string[];
  note?: string;
}

export const firstAidDatabase: FirstAidGuidance[] = [
  {
    id: "cut-scrape",
    title: "Cut or Scrape",
    keywords: ["cut", "scrape", "bleeding", "wound", "laceration", "abrasion"],
    steps: [
      "Clean your hands with soap and water or hand sanitizer.",
      "Rinse the cut or scrape with clean water to remove any dirt or debris.",
      "Clean around the wound with mild soap and water, but avoid getting soap in the wound.",
      "Apply gentle pressure with a clean cloth or bandage if there's bleeding until it stops (usually within a few minutes).",
      "Apply an antibiotic ointment to keep the surface moist and prevent infection.",
      "Cover with a sterile bandage or gauze held in place with medical tape."
    ],
    dos: [
      "Clean the wound thoroughly",
      "Change the bandage daily or when it gets dirty",
      "Watch for signs of infection (increased redness, swelling, warmth, or pus)"
    ],
    donts: [
      "Don't use hydrogen peroxide or iodine (can damage tissue)",
      "Don't blow on the wound (introduces bacteria)",
      "Don't leave a dirty wound unbandaged"
    ],
    medications: [
      "Antibiotic ointment (like Neosporin or Polysporin)",
      "Pain relievers like acetaminophen (Tylenol) or ibuprofen (Advil) if needed for pain"
    ]
  },
  {
    id: "minor-burn",
    title: "Minor Burn",
    keywords: ["burn", "hot", "scald", "steam", "first-degree", "second-degree"],
    steps: [
      "Cool the burn with cool (not cold) running water for 10-15 minutes.",
      "Remove any jewelry or tight items from the burned area before swelling occurs.",
      "Apply a gentle moisturizer or aloe vera gel to the burn (do not use butter, oil, or ice).",
      "Cover the burn loosely with a sterile gauze bandage.",
      "Take over-the-counter pain relievers like ibuprofen or acetaminophen if needed."
    ],
    dos: [
      "Cool the burn promptly",
      "Keep the burn clean",
      "Cover with a sterile, non-stick bandage"
    ],
    donts: [
      "Don't apply butter, oil, or ice to burns",
      "Don't break blisters",
      "Don't remove clothing that is stuck to the burned area"
    ],
    medications: [
      "Aloe vera gel",
      "Pain relievers like acetaminophen (Tylenol) or ibuprofen (Advil)",
      "Antibiotic ointment if recommended by a healthcare provider"
    ],
    note: "Seek medical attention for burns larger than 3 inches, burns on the face, hands, feet, genitals, or major joints, or if there's significant charring or white/brown coloration."
  },
  {
    id: "fever",
    title: "Fever Management",
    keywords: ["fever", "temperature", "hot", "chills", "sweating"],
    steps: [
      "Measure temperature with a thermometer to confirm fever (generally above 100.4°F or 38°C).",
      "Rest and drink plenty of fluids to stay hydrated.",
      "Take over-the-counter fever reducers like acetaminophen or ibuprofen as directed.",
      "Dress in lightweight clothing and use a light blanket or sheet for covering.",
      "Apply a cool, damp washcloth to the forehead, neck, or wrists."
    ],
    dos: [
      "Stay hydrated with water, clear broths, or electrolyte drinks",
      "Rest as much as possible",
      "Monitor temperature regularly"
    ],
    donts: [
      "Don't bundle up in heavy blankets or clothing",
      "Don't give aspirin to children or teenagers",
      "Don't take more than the recommended dose of fever reducers"
    ],
    medications: [
      "Acetaminophen (Tylenol)",
      "Ibuprofen (Advil, Motrin)",
      "Electrolyte solutions for rehydration"
    ],
    note: "Seek medical attention for fevers above 103°F (39.4°C), fevers lasting more than three days, or if accompanied by severe headache, stiff neck, confusion, or difficulty breathing."
  },
  {
    id: "sprain",
    title: "Sprain or Strain",
    keywords: ["sprain", "strain", "twisted", "ankle", "wrist", "joint", "swollen"],
    steps: [
      "Rest the injured area and avoid activities that cause pain.",
      "Apply ice wrapped in a cloth for 15-20 minutes, 3-4 times daily for the first 48 hours.",
      "Compress the area with an elastic bandage to reduce swelling (not too tight).",
      "Elevate the injured area above the level of the heart when possible.",
      "Take over-the-counter pain relievers as needed.",
      "After 48 hours, gentle heat can be applied to increase circulation and healing."
    ],
    dos: [
      "Follow RICE (Rest, Ice, Compression, Elevation)",
      "Use crutches or a brace if needed for support",
      "Begin gentle movement after a few days of rest"
    ],
    donts: [
      "Don't apply heat in the first 48 hours",
      "Don't massage the injured area",
      "Don't continue activities that cause pain"
    ],
    medications: [
      "Ibuprofen (Advil, Motrin) for pain and inflammation",
      "Acetaminophen (Tylenol) for pain"
    ],
    note: "Seek medical attention if you can't bear weight on the injured joint, if there's severe swelling or bruising, or if symptoms don't improve within a few days."
  },
  {
    id: "headache",
    title: "Headache Relief",
    keywords: ["headache", "migraine", "tension", "pain", "head", "throbbing"],
    steps: [
      "Rest in a quiet, dark room if possible.",
      "Apply a cool cloth to the forehead or back of the neck.",
      "Take over-the-counter pain relievers as directed.",
      "Stay hydrated and drink water.",
      "Try gentle massage of the temples, scalp, or neck muscles.",
      "Practice relaxation techniques like deep breathing or meditation."
    ],
    dos: [
      "Identify and avoid personal headache triggers",
      "Maintain regular sleep and meal schedules",
      "Stay hydrated throughout the day"
    ],
    donts: [
      "Don't strain your eyes with prolonged screen time",
      "Don't skip meals",
      "Don't overuse pain medication (can lead to rebound headaches)"
    ],
    medications: [
      "Acetaminophen (Tylenol)",
      "Ibuprofen (Advil, Motrin)",
      "Aspirin (for adults)",
      "Combination pain relievers specifically for headaches"
    ],
    note: "Seek immediate medical attention for a headache that comes on suddenly and severely, is accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness, or difficulty speaking."
  },
  {
    id: "allergic-reaction",
    title: "Mild Allergic Reaction",
    keywords: ["allergy", "allergic", "rash", "hives", "itching", "reaction"],
    steps: [
      "Identify and remove the allergen if possible.",
      "Wash the affected area with mild soap and water if the allergen is on the skin.",
      "Apply a cool compress to itchy areas.",
      "Take an over-the-counter antihistamine.",
      "Use calamine lotion or hydrocortisone cream for skin irritation.",
      "Monitor symptoms closely for any signs of worsening."
    ],
    dos: [
      "Keep track of what caused the reaction",
      "Stay hydrated",
      "Watch for breathing problems or swelling of the face/throat"
    ],
    donts: [
      "Don't scratch severely as it can lead to infection",
      "Don't ignore symptoms that are getting worse",
      "Don't continue to expose yourself to the allergen"
    ],
    medications: [
      "Oral antihistamines (like Benadryl, Zyrtec, Claritin)",
      "Hydrocortisone cream (for skin reactions)",
      "Calamine lotion (for itching)"
    ],
    note: "For severe allergic reactions involving difficulty breathing, swelling of the face/throat, or feeling faint, call emergency services (911) immediately as this could be anaphylaxis, which is life-threatening."
  },
  {
    id: "insect-bite",
    title: "Insect Bite or Sting",
    keywords: ["bite", "sting", "insect", "mosquito", "bee", "wasp", "spider", "tick"],
    steps: [
      "Remove the stinger if present (scrape it out with a card edge, don't squeeze).",
      "Clean the area with soap and water.",
      "Apply a cold compress to reduce pain and swelling.",
      "Elevate the affected limb if possible.",
      "Apply calamine lotion, hydrocortisone cream, or a paste of baking soda and water to reduce itching.",
      "Take an antihistamine to relieve itching and swelling."
    ],
    dos: [
      "Monitor for signs of allergic reaction",
      "Remove ticks properly with tweezers close to the skin",
      "Clean the area thoroughly"
    ],
    donts: [
      "Don't scratch as it can lead to infection",
      "Don't use tweezers to remove bee stingers (squeezes more venom in)",
      "Don't use home remedies like mud, meat tenderizer, or tobacco"
    ],
    medications: [
      "Oral antihistamines (like Benadryl, Zyrtec, Claritin)",
      "Hydrocortisone cream",
      "Pain relievers like acetaminophen or ibuprofen"
    ],
    note: "Seek medical attention if there's a severe allergic reaction, a large area of swelling, signs of infection, or if the bite is from a poisonous spider or scorpion."
  },
  {
    id: "nosebleed",
    title: "Nosebleed",
    keywords: ["nose", "bleed", "nosebleed", "bloody", "nasal"],
    steps: [
      "Sit upright and lean slightly forward (don't tilt your head back).",
      "Pinch the soft part of your nose shut with your thumb and index finger.",
      "Hold the pressure continuously for 10-15 minutes without checking if the bleeding has stopped.",
      "Breathe through your mouth while applying pressure.",
      "Apply a cold compress to the bridge of the nose to constrict blood vessels.",
      "After the bleeding stops, avoid strenuous activity, bending over, or heavy lifting for 24 hours."
    ],
    dos: [
      "Keep the head higher than the heart",
      "Use a humidifier if dry air is causing nosebleeds",
      "Apply petroleum jelly inside nostrils if they're dry"
    ],
    donts: [
      "Don't tilt the head back (blood may run down the throat)",
      "Don't blow your nose for several hours after the bleeding stops",
      "Don't pick or put anything into the nose"
    ],
    medications: [
      "Saline nasal spray to keep nasal passages moist",
      "Petroleum jelly to prevent dryness"
    ],
    note: "Seek medical attention if the bleeding doesn't stop after 20 minutes of pressure, occurs after a head injury, or if nosebleeds are frequent."
  }
];
