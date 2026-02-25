// 30-Day New Owner Onboarding Data — Singapore-specific

export const WEEKS = [
  {
    week: 1,
    title: 'Week 1 — Settling In',
    subtitle: 'Admin, home setup & first routines',
    tasks: [
      {
        id: 'avs-licence',
        title: 'Register your dog\'s AVS licence',
        description: 'All dogs in Singapore must be licensed with the Animal & Veterinary Service.',
        detail: 'Dogs must be licensed within 30 days of ownership transfer. Sterilised dogs cost $15/year, unsterilised dogs cost $90/year. Renew annually — fines apply for unlicensed dogs.',
        link: 'https://www.nparks.gov.sg/avs/pets/owning-a-pet/getting-a-pet/dog-licence',
        linkLabel: 'Apply on AVS website',
        cost: '$15/year (sterilised) · $90/year (unsterilised)',
        legal: true,
      },
      {
        id: 'microchip',
        title: 'Verify microchip registration',
        description: 'Confirm the microchip is transferred to your name in the national registry.',
        detail: 'Your shelter should have handed over the microchip certificate. Confirm the chip is registered to you via the AVS online portal. If not yet transferred, contact your shelter to update the records.',
        link: 'https://www.nparks.gov.sg/avs/pets/owning-a-pet/getting-a-pet/microchipping-of-dogs',
        linkLabel: 'AVS microchip info',
        legal: true,
      },
      {
        id: 'leash-law',
        title: 'Know the public leash law — $200 fine',
        description: 'Dogs must be leashed in ALL public areas in Singapore. This is a legal requirement, not a guideline.',
        detail: 'Under the Animals and Birds Act, every dog in a public place must be on a leash held by a person capable of controlling it. "Public place" includes parks, void decks, corridors, lifts, streets, car parks, and any shared outdoor space. Off-leash is only permitted in designated dog runs (e.g. West Coast Park, Bishan-AMK Park). Non-compliance fine: from $200, up to $5,000 for repeat offences, enforced by AVS officers and NParks rangers.',
        legal: true,
        cost: 'Fine from $200 for non-compliance',
      },
      {
        id: 'buy-essentials',
        title: 'Buy the essentials',
        description: 'Leash, collar with ID tag, food & water bowls, crate or bed.',
        detail: 'Must-haves: 1.2–1.5m leash (retractable leads are discouraged in HDB areas), flat collar with metal ID tag engraved with your phone number, stainless steel or ceramic bowls, and a crate or bed for a "safe zone". Optional: pee pads, playpen, enzymatic cleaner for accidents.',
        cost: 'Est. $80–$150 for starter kit',
      },
      {
        id: 'hdb-intro',
        title: 'Introduce your dog to neighbours',
        description: 'A friendly introduction prevents complaints before they start.',
        detail: 'Knock on immediate neighbours\' doors with your dog on a short leash. Keep the visit brief (5 minutes). Share your contact number in case of concerns. This goodwill gesture significantly reduces the chance of HDB complaints.',
      },
      {
        id: 'home-base',
        title: 'Set up a dedicated home base area',
        description: 'A crate or pen gives your dog a safe, calm retreat.',
        detail: 'Place the crate or playpen in a quiet corner away from the front door. Line it with a blanket and include a worn T-shirt with your scent. Keep the door open initially so your dog can explore freely. Never use the crate as punishment.',
      },
      {
        id: 'toilet-spot',
        title: 'Establish a toilet training spot',
        description: 'Consistency is key — pick one indoor and one outdoor spot.',
        detail: 'Place pee pads in the same corner every time. Take your dog outside to the same grass patch after every meal, nap, and play session. Use the same command ("Go potty") and reward immediately after success. Accidents happen — clean with enzymatic cleaner to remove the scent.',
      },
      {
        id: 'dog-proof',
        title: 'Dog-proof your flat',
        description: 'Remove hazards before your dog discovers them.',
        detail: 'Common hazards: electrical cables (use cable organisers), toxic plants (pothos, lilies, rubber plants), cleaning chemicals under the sink, small items that can be swallowed, open balconies (install safety netting if needed). In Singapore, all balconies with pets must be secured — this is an HDB requirement.',
      },
      {
        id: 'feeding-schedule',
        title: 'Set a consistent feeding schedule',
        description: 'Regular meal times help with toilet training and anxiety.',
        detail: 'Adult dogs typically eat twice a day (morning and evening). Puppies may need 3–4 meals. Feed at the same times daily. Pick up the bowl after 20 minutes. Free-feeding (leaving food out all day) makes toilet training much harder and can cause weight issues.',
      },
    ],
  },
  {
    week: 2,
    title: 'Week 2 — Health & Hygiene',
    subtitle: 'Vet, vaccinations & preventive care',
    tasks: [
      {
        id: 'first-vet',
        title: 'Schedule and attend your first vet visit',
        description: 'Full health check within the first two weeks of adoption.',
        detail: 'Bring your adoption papers, vaccination records, and deworming history. The vet will do a full physical exam, check for parasites, and advise on any immediate health concerns. Singapore vets are used to shelter dogs — they\'ll guide you on what\'s needed next.',
        cost: 'Est. $50–$120 for a basic consult',
      },
      {
        id: 'vaccinations',
        title: 'Confirm and schedule vaccination plan',
        description: 'Core vaccines: C5 (dogs) or C3 — discuss timing with your vet.',
        detail: 'Core vaccines for Singapore dogs: DA2PP (Distemper, Adenovirus, Parvovirus, Parainfluenza) + Bordetella, often bundled as C5. Rabies vaccine is required if you plan to travel. Annual boosters are recommended. Shelters usually provide partial vaccination records — bring them to your vet.',
        legal: true,
      },
      {
        id: 'flea-tick',
        title: 'Start flea & tick prevention',
        description: 'Singapore\'s humidity makes year-round parasite prevention essential.',
        detail: 'Popular options: NexGard (monthly chewable), Bravecto (3-month chewable), Frontline Plus (monthly spot-on). Discuss with your vet which is best for your dog\'s size and lifestyle. Ticks are common in Singapore parks — prevention is far easier than treating a tick-borne illness.',
        cost: 'Est. $30–$80 per month depending on product and dog size',
      },
      {
        id: 'heartworm',
        title: 'Discuss heartworm prevention',
        description: 'Heartworm is transmitted by mosquitoes — Singapore is high-risk.',
        detail: 'Heartworm disease is life-threatening and treatment is expensive and difficult. Monthly prevention (Heartgard, Simparica Trio) is strongly recommended. Ask your vet to test for heartworm first before starting prevention if your dog\'s history is unknown.',
        cost: 'Est. $20–$40/month for prevention',
      },
      {
        id: 'deworming',
        title: 'Complete deworming protocol',
        description: 'Most shelter dogs need deworming upon adoption.',
        detail: 'Common intestinal parasites in Singapore: roundworm, hookworm, tapeworm, giardia. Shelters typically deworm before adoption but a vet may recommend a follow-up dose. Signs of worms: pot belly, weight loss, scooting, visible worms in stool.',
        cost: 'Est. $15–$40 per treatment',
      },
      {
        id: 'toilet-continue',
        title: 'Continue and reinforce toilet training',
        description: 'Week 2 is critical — maintain consistency to build the habit.',
        detail: 'By now your dog should be showing some understanding of the toilet spot. Continue rewarding immediately after success (within 2 seconds). If accidents are frequent, increase the number of outdoor toilet breaks to every 2 hours. Never punish accidents — just clean up calmly and reset.',
      },
      {
        id: 'bath-routine',
        title: 'Introduce bath and grooming routine',
        description: 'First bath should be calm and positive.',
        detail: 'Use lukewarm water and dog-specific shampoo. In Singapore\'s heat, once every 2–3 weeks is typical. Dry thoroughly — humid conditions make moisture-related skin infections common. Introduce the blow dryer on low heat if needed. Reward throughout to build a positive association.',
      },
    ],
  },
  {
    week: 3,
    title: 'Week 3 — Training & Socialisation',
    subtitle: 'Commands, leash manners & community',
    tasks: [
      {
        id: 'basic-obedience',
        title: 'Teach basic obedience: sit, stay, come, leave it',
        description: '5–10 minutes of training twice daily — short sessions work best.',
        detail: 'Start with "sit" (easiest) using a treat held above the nose. Progress to "stay" (increase duration gradually), "come" (recall — most important for safety), and "leave it" (critical around food and rubbish in Singapore parks). Use positive reinforcement only — no punishment.',
      },
      {
        id: 'leash-training',
        title: 'Practice leash manners in the corridor',
        description: 'Loose-leash walking practice before heading outside.',
        detail: 'Practice in your HDB corridor or void deck first — less distracting than outside. Stop walking the moment the leash tightens. Resume when the dog returns to your side. The goal: dog walks beside you with a J-shaped (loose) leash. This takes weeks — be patient.',
      },
      {
        id: 'first-walk',
        title: 'Take your first outdoor walk',
        description: 'Choose cool hours: 7–9am or after 7pm to avoid heat stress.',
        detail: 'In Singapore, pavement temperatures at midday can exceed 60°C — dangerous for paw pads. Choose shaded routes (park connectors, void decks). Bring water for your dog. Keep the first walk short (10–15 minutes). Watch for signs of overheating: excessive panting, drooling, or slowing down.',
      },
      {
        id: 'grooming-book',
        title: 'Book a professional grooming appointment',
        description: 'Most dog groomers in Singapore recommend 4–6 week intervals.',
        detail: 'For HDB breeds (shorter coats), grooming every 4–8 weeks is typical. Services usually include bath, blow-dry, ear cleaning, nail trim, and anal gland expression. Prices in Singapore range from $60–$150 depending on breed size. Book in advance — popular groomers have waitlists.',
        cost: 'Est. $60–$150 per session',
      },
      {
        id: 'community',
        title: 'Join a local dog owner community',
        description: 'Find support, recommendations, and dog-friendly meetups.',
        detail: 'Useful Singapore communities: "Dog Owners Singapore" Facebook group, r/singapore (pet threads), CarousellPets for secondhand supplies, HDB Paw Pals (Facebook). Local vet clinics often have notice boards. A community gives you access to trusted vet and groomer recommendations.',
      },
      {
        id: 'socialisation',
        title: 'Begin structured socialisation',
        description: 'Positive exposure to people, sounds, and environments.',
        detail: 'Expose your dog to: different people (hats, uniforms, children), sounds (traffic, MRT noise, lift beeps), surfaces (tiles, gravel, grass, metal gratings). Keep each new experience positive — treat generously and don\'t force interactions. The critical socialisation window is before 16 weeks for puppies, but adult dogs benefit too.',
      },
    ],
  },
  {
    week: 4,
    title: 'Week 4 — Into Routine',
    subtitle: 'Consistency, classes & long-term planning',
    tasks: [
      {
        id: 'walk-schedule',
        title: 'Establish a consistent daily walk schedule',
        description: 'Morning and evening walks become the backbone of your routine.',
        detail: 'Aim for at least 30–45 minutes of walking split across 2 sessions. Morning: 7–9am before the heat builds. Evening: after 7pm when temperatures drop. HDB dogs benefit greatly from consistent outdoor time — it reduces anxiety, excessive barking, and destructive behaviour.',
      },
      {
        id: 'advanced-social',
        title: 'Continue advanced socialisation',
        description: 'Dog parks, café meetups, and structured dog-to-dog interactions.',
        detail: 'Singapore dog-friendly venues: West Coast Park, Bishan-AMK Park, East Coast Park dog runs. Always keep your dog on a leash until you know how they interact. Introduce dog-to-dog meetings on neutral ground. Watch for stress signals: stiff body, whale eye, lip licking, tail tucked.',
      },
      {
        id: 'obedience-class',
        title: 'Book a group obedience class',
        description: 'Professional training accelerates progress and builds confidence.',
        detail: 'Recommended Singapore trainers: SDTC (Singapore Dog Training Club), K9 Club, Perfect Pets, and various positive-reinforcement trainers found on Facebook. Group classes are great for socialisation while learning. Avoid trainers using punishment-based methods (prong collars, e-collars).',
        cost: 'Est. $200–$500 for a 6–8 week group course',
      },
      {
        id: 'public-manners',
        title: 'Practice leash manners in public',
        description: 'Void decks, bus stops, and markets with distractions.',
        detail: 'Practice the skills from Week 3 in busier environments: hawker centres (sit-stay while you queue), bus stops (calm waiting), wet markets. Always use a short leash in public. Carry treats to reinforce good behaviour. This is also when you formalise the "heel" command.',
      },
      {
        id: 'hdb-walk',
        title: 'Master HDB common area etiquette',
        description: 'Lifts, corridors, void decks — the rules every HDB dog owner must know.',
        detail: 'In HDB lifts: shorten the leash, ask others if they\'re comfortable before entering, position your dog behind you. In corridors: keep to the left, let others pass. At void decks: don\'t allow jumping on strangers. Always pick up waste immediately — a $1,000 fine applies for failing to do so.',
        legal: true,
      },
      {
        id: 'toilet-review',
        title: 'Review and consolidate toilet training',
        description: 'By week 4, accidents should be rare — troubleshoot if not.',
        detail: 'If accidents are still frequent, rule out medical causes first (UTI, bladder issues). Revisit the basics: more frequent outdoor trips, tighter supervision indoors, enzymatic cleaner for all accident spots. Some dogs take 6–8 weeks to fully toilet train — this is normal.',
      },
      {
        id: 'next-vet',
        title: 'Schedule your next vet visit',
        description: 'Plan the next check-up and vaccination booster in advance.',
        detail: 'Book the next appointment before leaving the vet after your Week 2 visit, or call now to schedule. Annual wellness checks, dental assessments, and booster vaccines are the minimum. Consider pet insurance — Singapore options include Etiqa, NTUC Income, and AXA SmartPet.',
        cost: 'Pet insurance: est. $30–$120/month depending on coverage',
      },
    ],
  },
];

export const GUIDES = [
  {
    id: 'first-vet',
    title: 'First Vet Visit Guide',
    icon: '🏥',
    sections: [
      {
        heading: 'What to bring',
        items: [
          'Adoption papers / transfer documents',
          'Vaccination record (from shelter)',
          'Deworming history if available',
          'Any medications your dog is currently on',
          'Stool sample (optional but helpful for parasite check)',
        ],
      },
      {
        heading: 'What happens at the visit',
        items: [
          'Weight measurement and body condition score',
          'Full physical exam: eyes, ears, teeth, skin, abdomen',
          'Heart and lung auscultation',
          'Discussion of vaccination schedule',
          'Parasite prevention plan',
          'Any specific concerns you have',
        ],
      },
      {
        heading: 'Core vaccination schedule (Singapore)',
        items: [
          'C5 bundle (DA2PP + Bordetella): covers Distemper, Parvovirus, Adenovirus, Parainfluenza, Kennel Cough',
          'Puppies: 3-shot primary series at 8, 12, and 16 weeks — then annual booster',
          'Adult dogs (>1 year, unknown history): 2 shots 3–4 weeks apart, then annual',
          'Rabies: not required for Singapore-based dogs unless travelling internationally',
          'Leptospirosis: recommended for dogs frequenting parks, beaches, or wet areas',
          'Bordetella (Kennel Cough): required by most boarding and grooming facilities',
          'Bring your shelter vaccination record — your vet will confirm what\'s already done',
        ],
      },
      {
        heading: 'Estimated costs (SGD)',
        items: [
          'Basic consult: $50–$80',
          'Full wellness exam: $80–$120',
          'Blood panel (optional first visit): $80–$150',
          'Flea/tick treatment: $30–$80',
          'Deworming: $15–$40',
        ],
      },
      {
        heading: 'Tip',
        items: [
          'Bring your dog slightly hungry — treats work much better for cooperation during the exam.',
          'Write down your questions beforehand. Vets in Singapore are thorough but busy.',
        ],
      },
    ],
  },
  {
    id: 'adore',
    title: 'Project ADORE Guide',
    icon: '🏠',
    intro: 'Project ADORE (Adoption and Rehoming of Dogs) is an AVS initiative allowing Singapore residents to rehome dogs of non-HDB approved breeds if they already live in HDB flats (existing ownership only). It does not allow new adoptions of non-approved breeds into HDB flats.',
    steps: [
      { step: 1, title: 'Check eligibility', detail: 'Only dogs already living in an HDB flat (pre-existing ownership) are eligible. Newly adopted dogs must be of AVS-approved breeds for HDB.' },
      { step: 2, title: 'Apply via AVS', detail: 'Submit an application at nparks.gov.sg/avs. Provide proof of ownership, current AVS licence, microchip certificate, and proof of HDB residency (utility bill or tenancy agreement).' },
      { step: 3, title: 'Home assessment', detail: 'An AVS officer visits to assess flat suitability: usable space for the dog\'s size, window grilles or mesh (mandatory), no balcony hazards, and evidence of proper containment. The officer will also observe how the dog behaves in the home environment.' },
      { step: 4, title: 'Temperament check', detail: 'The dog is assessed for aggression, excessive fear responses, and unpredictability around strangers. Passing criteria: no lunging or snapping at the officer, no sustained aggressive barking, able to be handled without extreme stress. Dogs with a history of biting or aggression complaints are unlikely to pass. The officer may ask you to walk the dog in the corridor to observe leash behaviour.' },
      { step: 5, title: 'Trial period', detail: 'If approved, a 3–6 month trial period is granted. During this time: zero noise complaints, no reports of the dog roaming unleashed, and the dog must remain registered and licensed. Any HDB or neighbour complaint during the trial may result in immediate revocation of ADORE status.' },
      { step: 6, title: 'Final approval', detail: 'Successful trial leads to formal ADORE approval. The approval is tied to the specific flat and the registered owner — it does not transfer if you move flat, change ownership, or acquire a second dog.' },
    ],
    note: 'Project ADORE does not apply to newly adopted dogs. For new adoptions into HDB flats, only AVS-approved breeds (35 small breeds) are permitted.',
  },
  {
    id: 'faq',
    title: 'Week 1 FAQ',
    icon: '❓',
    questions: [
      {
        q: 'My dog is hiding under the bed / behind furniture — is this normal?',
        a: 'Yes — hiding is one of the most common stress behaviours in newly adopted dogs, especially shelter dogs. It\'s their way of saying "I need to feel safe". Do not drag your dog out or reach under the furniture to pet them. Instead, sit quietly on the floor nearby, speak softly, and let them emerge in their own time. Leave a trail of high-value treats leading out. Most dogs start exploring on their own within 3–7 days. Provide a covered crate or bed as an official "safe zone" they can retreat to without being disturbed.',
      },
      {
        q: 'My dog isn\'t eating — is that normal?',
        a: 'Yes. Most dogs take 2–5 days to eat normally in a new home. Stress suppresses appetite. Keep offering regular meals. If refusal continues past 5–7 days or the dog seems unwell, call your vet.',
      },
      {
        q: 'My dog is crying at night — what do I do?',
        a: 'This is very common in the first week. Try placing a worn T-shirt with your scent in the crate. A ticking clock wrapped in a towel can simulate a heartbeat. Avoid rushing in immediately — wait for a pause in crying before reassuring. Gradual improvement is expected by night 3–5.',
      },
      {
        q: 'How much should I let my dog explore the flat immediately?',
        a: 'Start small. Limit access to one or two rooms initially using baby gates or closed doors. Expand access gradually over the first week as toilet training establishes. Too much space too soon = accidents everywhere.',
      },
      {
        q: 'Can I bring my dog to a HDB void deck or corridor?',
        a: 'Yes, but always on a leash. Dogs must be leashed in all HDB common areas. Keep them away from food areas and pick up waste immediately. Be mindful of neighbours who may be uncomfortable around dogs.',
      },
      {
        q: 'My dog seems scared of everything — is something wrong?',
        a: 'Fearfulness in the first 1–2 weeks is normal — especially for shelter dogs who may not have been socialised. Give your dog time and space. Don\'t force interactions. Use high-value treats to create positive associations. If fear is severe (shaking, not eating, elimination from fear), contact your vet.',
      },
      {
        q: 'My dog keeps having toilet accidents indoors — what am I doing wrong?',
        a: 'Nothing is "wrong" — accidents in the first 1–3 weeks are completely normal. The fix: increase the number of outdoor toilet trips to every 1–2 hours, plus immediately after every meal, nap, and play session. Use a single consistent toilet command ("Go potty" or "Do your business") and reward with a treat within 2 seconds of success outdoors. For accidents indoors, clean with enzymatic cleaner — regular detergent leaves a scent trace that encourages your dog to use the same spot again. Never punish accidents after the fact; dogs cannot connect past actions to present scolding.',
      },
      {
        q: 'Do I need to wash my dog immediately after adoption?',
        a: 'Not necessarily. Wait until your dog is settled (Day 3–5 minimum). Shelters usually bathe dogs before adoption. A too-early bath in an unfamiliar home can increase stress. Prioritise bonding first, grooming second.',
      },
    ],
  },
  {
    id: 'hdb-etiquette',
    title: 'HDB Dog Etiquette',
    icon: '🏢',
    rules: [
      {
        rule: 'Always leash in common areas',
        detail: 'Leashing is legally required in all HDB common areas — corridors, void decks, car parks, and lifts. Use a short leash (not retractable) for better control.',
      },
      {
        rule: 'Lift etiquette',
        detail: 'Shorten the leash before entering. Ask other passengers if they\'re comfortable. Position your dog behind you or to the side. If a passenger seems uncomfortable, wait for the next lift.',
      },
      {
        rule: 'Pick up waste immediately',
        detail: 'This is legally required. Failure to clean up after your dog is a $1,000 fine under the Parks and Trees Act. Carry poo bags at all times — attach a roll to your leash.',
      },
      {
        rule: 'No barking after 10pm',
        detail: 'Excessive barking is grounds for an HDB complaint. Manage barking through training, enrichment (food puzzles), and adequate exercise. Separation anxiety is the leading cause — address early.',
      },
      {
        rule: 'Only approved breeds for HDB',
        detail: 'Only the 35 AVS-approved small dog breeds are permitted in HDB flats. The weight limit is 15kg at full growth. Mixed breeds are permitted if they do not physically resemble a prohibited breed.',
      },
      {
        rule: 'No feeding stray dogs near your block',
        detail: 'Feeding strays near your HDB block can attract nuisance complaints and is discouraged by town councils. If you want to help strays, contact a registered community cat/dog programme in your area.',
      },
    ],
  },
  {
    id: 'legal',
    title: 'Singapore Dog Laws',
    icon: '⚖️',
    requirements: [
      { item: 'Dog licence', detail: 'All dogs must be licensed with AVS. Penalty: up to $5,000 fine.' },
      { item: 'Microchipping', detail: 'All dogs must be microchipped and the chip registered to the current owner.' },
      { item: 'Leash in public', detail: 'Dogs must be leashed in all public areas. Penalty: up to $5,000 fine.' },
      { item: 'Waste pick-up', detail: 'You must clean up after your dog in public. Penalty: $1,000 fine.' },
      { item: 'Rabies vaccination', detail: 'Not required for Singapore-based dogs unless travelling internationally.' },
      { item: 'HDB breed rules', detail: 'Only 35 AVS-approved breeds allowed in HDB flats. Max weight: 15kg at maturity.' },
      { item: 'Dangerous dogs', detail: 'Certain breeds (Pit Bulls, Rottweilers, etc.) are prohibited in Singapore entirely. Penalty: seizure and destruction of dog.' },
    ],
    fineCallout: {
      headline: '⚖️ $200–$1,000 fine for not leashing your dog in public',
      detail: 'Leash law applies to ALL public areas — parks, void decks, corridors, lifts, and any shared public space. This is enforced by AVS officers and NParks rangers.',
    },
  },
];

// ── Climate & Wellness Guides ─────────────────────────────────────────────────
export const CLIMATE_GUIDES = [
  {
    id: 'sg-climate',
    title: 'Walk Timing & Heat Safety',
    icon: '☀️',
    sections: [
      {
        heading: 'Safe walk times in Singapore',
        items: [
          'Morning: 6:30am–9:00am — coolest part of the day, ideal for longer walks',
          'Evening: 7:00pm onwards — pavement temperature has dropped, lower UV',
          'Avoid: 10am–6pm — pavement can exceed 60°C, causing paw pad burns within 60 seconds',
          'Test the pavement with your palm for 5 seconds — if it\'s uncomfortable for you, it\'s dangerous for your dog',
        ],
      },
      {
        heading: 'Heat stress warning signs',
        items: [
          'Excessive panting and drooling beyond normal exertion',
          'Bright red gums and tongue',
          'Slowing down, reluctance to move, sudden stops',
          'Glazed or unfocused eyes',
          'Vomiting or stumbling — emergency: go to vet immediately',
        ],
      },
      {
        heading: 'Keeping cool at home',
        items: [
          'Keep AC at 24–26°C for breeds sensitive to heat (brachycephalic, double-coated)',
          'Provide fresh cold water at all times — add ice cubes on very hot days',
          'Cooling mats (gel or water-filled) are effective and available in most SG pet stores',
          'Never leave a dog in a parked car — temperature reaches 50°C+ in under 10 minutes',
          'Avoid car park areas and concrete void decks during peak heat hours',
        ],
      },
    ],
  },
  {
    id: 'heatstroke',
    title: 'Heatstroke: Symptoms & Emergency Response',
    icon: '🌡️',
    sections: [
      {
        heading: 'Recognising heatstroke',
        items: [
          'Rapid, heavy panting that doesn\'t slow even when resting',
          'Excessive drooling — thick, rope-like saliva',
          'Gums turning bright red, pale, or blue-grey (most serious)',
          'Vomiting or diarrhoea (sometimes with blood)',
          'Muscle tremors, seizures, or sudden collapse',
          'Body temperature above 40°C — use a rectal thermometer if available',
        ],
      },
      {
        heading: 'What to do immediately',
        items: [
          '1. Move to shade or AC indoors immediately — do not wait',
          '2. Wet the dog with COOL (not ice cold) water — focus on paws, armpits, groin, and neck',
          '3. Place in front of a fan or AC vent to speed evaporative cooling',
          '4. Offer small amounts of cool water to drink — do not force',
          '5. Call your vet or an emergency clinic while doing steps 1–4',
          '⚠️ Do not use ice water or ice packs — rapid cooling can cause shock',
          '⚠️ Do not delay going to a vet even if the dog seems to recover',
        ],
      },
      {
        heading: '24-hour emergency vet clinics in Singapore',
        items: [
          'Mount Pleasant Animal Medical Centre (Whitley) — 24hr · 6250 8333',
          'Mount Pleasant Animal Medical Centre (East) — 24hr · 6344 3036',
          'The Animal Clinic (Toa Payoh) — 24hr emergency line · 6258 6068',
          'Amber Vet (Alexandra) — 24hr · 6736 0328',
          'Beecroft Animal Specialists (Novena) — 24hr specialist · 6779 7668',
          'Always call ahead to confirm current operating hours before travelling',
        ],
      },
      {
        heading: 'High-risk breeds for heatstroke',
        items: [
          'Brachycephalic (flat-nosed): Pugs, Bulldogs, Shih Tzu, French Bulldogs, Boston Terriers, Pekingese',
          'Thick double-coated: Huskies, Malamutes, Chow Chows, Pomeranians',
          'Overweight or senior dogs of any breed',
          'Dogs with prior respiratory or heart conditions',
          'Singapore Specials are more heat-adapted but still at risk in extreme heat',
        ],
      },
    ],
  },
  {
    id: 'tick-flea-monthly',
    title: 'Monthly Tick & Flea Prevention',
    icon: '🦟',
    sections: [
      {
        heading: 'Why year-round prevention matters in Singapore',
        items: [
          'Singapore\'s warm, humid climate (26–33°C year-round) creates ideal conditions for ticks and fleas',
          'There is no "off season" — parasites are active 12 months of the year',
          'Tick-borne diseases in SG: Ehrlichiosis, Anaplasmosis, and Rocky Mountain Spotted Fever have all been recorded',
          'Fleas cause skin dermatitis and can transmit tapeworm if accidentally ingested during grooming',
        ],
      },
      {
        heading: 'Prevention options (monthly unless stated)',
        items: [
          'NexGard (monthly chewable) — covers ticks and fleas, popular in Singapore',
          'Bravecto (3-month chewable) — convenient, available at most SG vets',
          'Simparica Trio (monthly) — also covers heartworm and intestinal parasites',
          'Frontline Plus (monthly spot-on) — topical, suitable for dogs that resist chewables',
          'Seresto collar (8-month protection) — good for dogs with irregular treatment schedules',
          'Ask your vet — some products need prescription; dosing is weight-dependent',
        ],
      },
      {
        heading: 'When to check for ticks after walks',
        items: [
          'After any walk in parks, nature areas, or grass — especially East Coast Park, MacRitchie, Bukit Timah',
          'Check between toes, in ear flaps, around the collar, under the tail, and in groin folds',
          'Use a tick remover tool — do not pull with fingers or twist, which can leave mouthparts embedded',
          'If you find a tick, remove it and monitor the area for 2 weeks; see a vet if you notice lethargy or fever',
        ],
      },
    ],
  },
  {
    id: 'lepto',
    title: 'Leptospirosis Risk in Singapore',
    icon: '🧫',
    sections: [
      {
        heading: 'What is leptospirosis and why Singapore is high-risk',
        items: [
          'Leptospirosis is a bacterial infection spread through the urine of infected animals — primarily rats',
          'Singapore\'s dense urban rat population and frequent heavy rain create an elevated risk',
          'Dogs can be exposed through puddles, drains, wet grass, and flooded areas containing rat urine',
          'Leptospirosis is zoonotic — it can be transmitted from dogs to humans, a public health concern',
        ],
      },
      {
        heading: 'Symptoms to watch for',
        items: [
          'Sudden fever and shivering',
          'Reluctance to move, muscle pain or stiffness',
          'Vomiting, loss of appetite, excessive thirst',
          'Jaundice (yellowing of eyes, gums, or skin) — indicates liver involvement',
          'Symptoms can appear 2–30 days after exposure; early treatment is critical',
        ],
      },
      {
        heading: 'Vaccination schedule (Singapore)',
        items: [
          'Leptospirosis (Lepto-4) vaccine: covers 4 serovars including those prevalent in SG',
          'Initial course: 2 injections 3–4 weeks apart for unvaccinated adult dogs',
          'Booster: annually — more frequently (every 6 months) for high-exposure dogs',
          'High-exposure dogs: those that regularly visit parks, water, flooded areas, or rural SG',
          'Often bundled into the C5+ or C7 combination vaccine — ask your vet',
          'The standard C5 does NOT cover Leptospirosis — confirm with your vet',
        ],
      },
      {
        heading: 'Reducing exposure risk',
        items: [
          'Avoid letting your dog drink from puddles, drains, or standing water',
          'Be extra cautious after heavy rain or during the wet season (Oct–Jan, Apr–May)',
          'If your dog swims in canals, reservoirs, or coastal waters, discuss lepto vaccination with your vet',
          'Dry your dog\'s paws thoroughly after wet-ground walks',
        ],
      },
    ],
  },
  {
    id: 'skin-coat',
    title: 'Skin & Coat Health in Humidity',
    icon: '🪮',
    sections: [
      {
        heading: 'Why Singapore\'s humidity is hard on dog skin',
        items: [
          'Relative humidity of 70–90% creates ideal conditions for bacterial and fungal skin infections',
          'Moisture trapped under thick coats or in skin folds leads to hot spots and pyoderma (skin infection)',
          'Malassezia (yeast) overgrowth is very common in SG — causes smelly, greasy skin and itching',
          'After every walk: wipe paws and belly with a damp cloth and dry thoroughly',
          'Between-paw skin and skin folds (Shar Peis, Bulldogs) need daily inspection in humid months',
        ],
      },
      {
        heading: 'Recommended grooming frequency by coat type',
        items: [
          'Short smooth coat (Singapore Special, Beagle, Dachshund): bath every 4–6 weeks, brush weekly',
          'Medium coat (Labrador, Golden Retriever): bath every 3–4 weeks, brush 2–3x per week',
          'Long silky coat (Shih Tzu, Maltese, Yorkie): bath every 2–3 weeks, daily brush to prevent matting',
          'Double coat (Husky, Pomeranian, Corgi): bath every 4–6 weeks with deshedding treatment, brush 3–4x per week',
          'Curly/wavy coat (Poodle, Bichon): bath every 3–4 weeks, professional trim every 6–8 weeks',
          'In Singapore\'s humidity, shorter trims are often recommended for long-coated breeds (not shaving — it disrupts coat function)',
        ],
      },
      {
        heading: 'At-home grooming essentials',
        items: [
          'Use a dog-specific shampoo with anti-fungal properties for humid climates (e.g. Malaseb, Ketochlor)',
          'Always blow-dry thoroughly on cool/warm setting — damp undercoat in humidity leads to hot spots within hours',
          'Check ears weekly: Singapore dogs are prone to ear infections — smell for yeast, look for discharge',
          'Clean ears with a vet-recommended ear cleaner and dry cotton wool',
          'Trim nails every 3–4 weeks — long nails catch on HDB floor grating and cause posture problems',
        ],
      },
      {
        heading: 'Red flags: see a vet',
        items: [
          'Red, inflamed, or weeping hot spots (acute moist dermatitis) — need prompt vet treatment',
          'Strong musty or cheesy smell from skin or ears — likely yeast infection',
          'Hair loss in patches, excessive scratching, or chewing at paws',
          'Greasy, flaky skin that doesn\'t improve with regular grooming',
        ],
      },
    ],
  },
  {
    id: 'heat-breeds',
    title: 'Breed Heat Tolerance Guide',
    icon: '🐕',
    sections: [
      {
        heading: 'Heat-adapted breeds (lower risk in Singapore)',
        items: [
          'Singapore Special (mixed breed) — evolved here; the most heat-adapted dog in Singapore',
          'Basenji — short coat, African origin, very heat tolerant',
          'Thai Ridgeback — short coat, bred in tropical Southeast Asia',
          'Greyhound / Whippet — lean body, short coat; handles heat well despite HDB breed restrictions',
          'Jack Russell Terrier, Miniature Pinscher, Chihuahua — small body size helps with heat dissipation',
        ],
      },
      {
        heading: 'Heat-sensitive breeds: need extra care',
        items: [
          'Brachycephalic (flat-nosed): Pugs, Bulldogs, French Bulldogs, Boston Terriers, Shih Tzu, Pekingese — cannot pant efficiently; highest heatstroke risk',
          'Arctic / Nordic breeds: Siberian Husky, Alaskan Malamute, Samoyed, Chow Chow — dense double coat; not suited to Singapore climate',
          'Pomeranian, Keeshond, Finnish Spitz — double-coated; require indoor AC',
          'Senior dogs and overweight dogs of any breed — thermoregulation declines with age and excess weight',
        ],
      },
      {
        heading: 'Care tips for heat-sensitive breeds in Singapore',
        items: [
          'Keep AC at home between 23–26°C; never rely only on fans for brachycephalic dogs',
          'Walks maximum 15–20 minutes before 9am only; skip afternoon walks entirely in hot months',
          'Cooling vest or cooling mat recommended for brachycephalic breeds',
          'Trim (but never shave) double-coated breeds — the coat provides insulation both ways',
          'For brachycephalic breeds: consider soft palate or nostril surgery (nares widening) if they struggle to breathe; common procedure in Singapore',
          'Hydration is critical — offer cold water before, during, and after any outdoor activity',
        ],
      },
    ],
  },
  {
    id: 'wet-season',
    title: 'Wet Season Dog Care (Oct–Jan, Apr–May)',
    icon: '🌧️',
    sections: [
      {
        heading: 'Singapore\'s wet seasons and your dog',
        items: [
          'Northeast Monsoon: November–January (heaviest rainfall, flooding risk in low-lying areas)',
          'Inter-monsoon / Sumatra squalls: April–May (sudden heavy downpours, lightning)',
          'Flooding in parks and drains significantly raises Leptospirosis risk (see Lepto guide)',
          'The wet season also raises humidity further, increasing skin and ear infection risk',
        ],
      },
      {
        heading: 'After every wet-season walk',
        items: [
          'Dry your dog thoroughly before going indoors — a microfibre towel works best',
          'Lift each paw and dry between the toes — this is where fungal infections start',
          'Check for and dry any skin folds (Shar Peis, Bulldogs, Pomeranians with mane fur)',
          'If your dog walked through flooded ground, wipe paws with diluted Betadine or a pet-safe antiseptic wipe',
          'Do not allow your dog to drink from puddles or drain overflows',
        ],
      },
      {
        heading: 'Preventing fungal infections between paws',
        items: [
          'Signs of fungal growth: brown discolouration between toes, musty smell, excessive licking of paws',
          'Prevention: dry paws thoroughly after every walk, trim paw fur to minimise moisture retention',
          'Treatment (mild cases): diluted chlorhexidine foot soak, or antifungal sprays from pet stores',
          'Persistent paw fungal infections need veterinary antifungal treatment — do not ignore',
        ],
      },
      {
        heading: 'Managing walks during heavy rain',
        items: [
          'Lightning risk: do not walk outdoors during active thunderstorms — Singapore has one of the highest lightning densities in the world',
          'Use a covered void deck or indoor space for toilet breaks during heavy rain',
          'Dog boots can protect paws from flooded pavement but need acclimatisation',
          'Keep a dedicated drying towel and doormat at the entrance to your flat',
        ],
      },
    ],
  },
];
