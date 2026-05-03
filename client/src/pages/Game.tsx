import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { TitleScreen } from '@/components/TitleScreen';
import { EndScreen } from '@/components/EndScreen';
import { ImmersiveScene } from '@/components/ImmersiveScene';
import { TransparentDialogueBox } from '@/components/TransparentDialogueBox';
import { AdvancedSkillTree } from '@/components/AdvancedSkillTree';
import { PuzzleGame } from '@/components/PuzzleGame';
import { PUZZLE_LIBRARY } from '@/components/PuzzleGallery';
import { LocationIntro } from '@/components/LocationIntro';
import { ImageTransition } from '@/components/ImageTransition';

import { Settings } from 'lucide-react';
import { GameDrawer } from '@/components/GameDrawer';
import { SkillDrawer } from '@/components/SkillDrawer';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/hooks/useAudio';
import { getMusicForScene, getMusicForEnding } from '@/lib/musicLibrary';

interface DialogueOption {
  text: string;
  skillRequired?: 'medicine' | 'literature' | 'fencing' | 'languages';
  skillLevel?: number;
  awakeninglevelGain?: number;
  nextScene?: string;
}

interface SceneData {
  id: string;
  title: string;
  location: string;
  character: string;
  dialogue: string;
  portraitUrl: string;
  backgroundImage: string;
  options: DialogueOption[];
  skillPointReward?: number;
  transitionImage?: string;
}

// Expanded story scenes with family, friends, locations, love interests, allies, and enemies
const STORY_SCENES: Record<string, SceneData> = {
  // CHAPTER 1: THE SEED OF CALAMBA
  'calamba-intro': {
    id: 'calamba-intro',
    title: 'The Seed of Calamba',
    location: 'Calamba, Laguna Province, 1861',
    character: 'Mother (Teodora Alonzo)',
    dialogue: 'My son, do you see that moth struggling against the glass? It seeks the light beyond. So too must you struggle against the darkness of ignorance that chains our people. Our family has always been enlightened—your grandfather was a scholar, your father a man of principle. But the Spanish do not want us to think. They want us to obey. Will you be different?',
    portraitUrl: '/images/characters/Teodora_Alonzo.png',
    backgroundImage: '/images/backgrounds/calamba_home.png', // Anime Traditional Interior (Calamba)
    options: [
      {
        text: 'I will become a scholar and expose the truth through writing.',
        awakeninglevelGain: 2,
        nextScene: 'calamba-father-transition',
      },
      {
        text: 'I will learn medicine to heal our suffering people.',
        awakeninglevelGain: 1,
        nextScene: 'calamba-father-transition',
      },
      {
        text: 'I will master all skills—knowledge, art, and strength.',
        awakeninglevelGain: 3,
        nextScene: 'calamba-father-transition',
      },
    ],
    skillPointReward: 1,
  },

  'calamba-father-transition': {
    id: 'calamba-father-transition',
    title: 'The Seed of Calamba',
    location: 'Calamba, Laguna Province, 1861',
    character: 'Mentor',
    dialogue: '',
    portraitUrl: '',
    backgroundImage: '/images/backgrounds/calamba_home.png',
    options: [{ text: 'Continue', nextScene: 'calamba-father' }],
    transitionImage: '/images/characters/Mentor_Transition.png',
  },

  'calamba-father': {
    id: 'calamba-father',
    title: 'The Seed of Calamba',
    location: 'Calamba, Laguna Province, 1861',
    character: 'Father (Francisco Mercado)',
    dialogue: 'Your mother speaks truth, Jose. I have seen how the friars exploit our lands, how they mock our intelligence. Your older brother Paciano has already joined the resistance—quietly, carefully. The path you choose will determine not just your fate, but the fate of our nation. The Spanish fear educated Filipinos more than they fear weapons.',
    portraitUrl: '/images/characters/Francisco_Mercado.png',
    backgroundImage: '/images/backgrounds/calamba_home.png', // Anime Traditional Interior (Calamba)
    options: [
      {
        text: 'I will work with Paciano and the resistance movement.',
        awakeninglevelGain: 2,
        nextScene: 'calamba-paciano',
      },
      {
        text: 'I will pursue education first, then decide my path.',
        awakeninglevelGain: 1,
        nextScene: 'calamba-paciano',
      },
      {
        text: 'I must understand both the enemy and the people before acting.',
        awakeninglevelGain: 2,
        nextScene: 'calamba-paciano',
      },
    ],
  },

  'calamba-paciano': {
    id: 'calamba-paciano',
    title: 'The Burden of a Name',
    location: 'Calamba, Laguna Province, 1872',
    character: 'Paciano Rizal (Older Brother)',
    dialogue: 'Jose, you must leave for Manila to study. But you cannot use our family name "Mercado". The Spanish are watching me closely because of my ties to Father Burgos. After they unjustly executed the Gomburza priests, anyone associated with them is a target. From now on, you will use our second surname, "Rizal". Let my reputation shield you while you arm yourself with knowledge.',
    portraitUrl: '/images/characters/Paciano_Rizal.png', // Using Father's portrait as placeholder for Paciano if it doesn't exist
    backgroundImage: '/images/backgrounds/calamba_home.png',
    options: [
      {
        text: 'I understand. I will carry the name Rizal with honor.',
        skillRequired: 'literature',
        skillLevel: 1,
        awakeninglevelGain: 2,
        nextScene: 'ateneo-intro',
      },
      {
        text: 'Why should we hide? The Mercado name is ours!',
        awakeninglevelGain: 3,
        nextScene: 'ateneo-intro',
      },
      {
        text: 'A name is just a word. My actions will define me.',
        awakeninglevelGain: 1,
        nextScene: 'ateneo-intro',
      },
    ],
    skillPointReward: 1,
  },

  // CHAPTER 2: THE STUDENT OF MANILA
  'ateneo-intro': {
    id: 'ateneo-intro',
    title: 'The Student of Manila',
    location: 'Ateneo Municipal, Manila, 1872',
    character: 'Jesuit Priest (Father Rector)',
    dialogue: 'Young Rizal, you show remarkable promise in your studies. Your essays are eloquent, your mind sharp. But I warn you—do not let your intelligence become a weapon against the Church. The Jesuits educate you to become a better servant of Spain and God. Some of your classmates whisper dangerous ideas. Be careful which friendships you cultivate.',
    portraitUrl: '/images/characters/Father_Rector.png',
    backgroundImage: '/images/backgrounds/ateneo_classroom.png', // Anime Classroom (Ateneo)
    options: [
      {
        text: 'I will excel in my studies while secretly questioning the system.',
        skillRequired: 'literature',
        skillLevel: 1,
        awakeninglevelGain: 2,
        nextScene: 'ateneo-friends',
      },
      {
        text: 'I will seek out classmates who share my doubts about Spanish rule.',
        awakeninglevelGain: 2,
        nextScene: 'ateneo-friends',
      },
      {
        text: 'I will focus purely on academic excellence for now.',
        awakeninglevelGain: 1,
        nextScene: 'ateneo-friends',
      },
    ],
    skillPointReward: 1,
  },

  'ateneo-friends': {
    id: 'ateneo-friends',
    title: 'The Student of Manila',
    location: 'Ateneo Municipal, Manila, 1872',
    character: 'Classmate (Mariano Jhocson)',
    dialogue: 'Jose, we know you come from a progressive family. There are others like us—students who see through the lies the friars teach. Marcelo del Pilar, Graciano Lopez Jaena, even some older Filipinos in Manila are organizing. They publish pamphlets, they debate ideas. Some say we should prepare for armed rebellion. Others believe education and writing are our weapons. Which do you believe?',
    portraitUrl: '/images/characters/Mariano_Jhocson.png',
    backgroundImage: '/images/backgrounds/ateneo_classroom.png', // Anime Classroom (Ateneo)
    options: [
      {
        text: 'The pen is mightier than the sword. I will become a writer.',
        skillRequired: 'literature',
        skillLevel: 2,
        awakeninglevelGain: 2,
        nextScene: 'ateneo-leonor-letters',
      },
      {
        text: 'Both are necessary. I will master all forms of resistance.',
        awakeninglevelGain: 3,
        nextScene: 'ateneo-leonor-letters',
      },
      {
        text: 'I need to understand more before committing to any movement.',
        awakeninglevelGain: 1,
        nextScene: 'ateneo-leonor-letters',
      },
    ],
  },

  'ateneo-leonor-letters': {
    id: 'ateneo-leonor-letters',
    title: 'Secrets in Ink',
    location: 'Manila, 1880',
    character: 'Leonor Rivera',
    dialogue: 'It is getting harder to write to you, Jose. My mother intercepts the mail, and the friars have eyes everywhere. From now on, address your letters to "Taimis". It will be our secret—a hidden world where we can speak freely of love and revolution without fear of discovery. But secrecy is a heavy burden. How long can we live in shadows?',
    portraitUrl: '/images/characters/Leonor_Rivera.png',
    backgroundImage: '/images/backgrounds/ateneo_classroom.png',
    options: [
      {
        text: 'As long as it takes. Our secret, Taimis, is safe with me.',
        skillRequired: 'languages',
        skillLevel: 2,
        awakeninglevelGain: 1,
        nextScene: 'ateneo-love-transition',
      },
      {
        text: 'One day, we will not have to hide anymore.',
        awakeninglevelGain: 2,
        nextScene: 'ateneo-love-transition',
      },
      {
        text: 'If shadows protect us, then I welcome the dark.',
        awakeninglevelGain: 2,
        nextScene: 'ateneo-love-transition',
      },
    ],
    skillPointReward: 1,
  },

  'ateneo-love-transition': {
    id: 'ateneo-love-transition',
    title: 'The Student of Manila',
    location: 'Ateneo Municipal, Manila, 1872',
    character: 'Transition',
    dialogue: '',
    portraitUrl: '',
    backgroundImage: '/images/backgrounds/ateneo_classroom.png',
    options: [{ text: 'Continue', nextScene: 'ateneo-love' }],
    transitionImage: '/images/characters/Leonor_Transition.png',
  },

  'ateneo-love': {
    id: 'ateneo-love',
    title: 'The Student of Manila',
    location: 'Ateneo Municipal, Manila, 1872',
    character: 'Leonor Rivera (Love Interest)',
    dialogue: 'Jose, I have read your poems. They are beautiful, but they are also dangerous. You write of freedom, of injustice. My family is Spanish-aligned—my father would forbid our friendship if he knew. But I believe in what you believe. If you pursue this path, know that there will be sacrifices. People will be hurt. Are you prepared for that?',
    portraitUrl: '/images/characters/Leonor_Rivera.png',
    backgroundImage: '/images/backgrounds/ateneo_classroom.png', // Anime Classroom (Ateneo)
    options: [
      {
        text: 'I will protect you and our love above all else.',
        awakeninglevelGain: 1,
        nextScene: 'europe-intro-transition',
      },
      {
        text: 'Our nation must come first. I hope you can understand.',
        awakeninglevelGain: 2,
        nextScene: 'europe-intro-transition',
      },
      {
        text: 'Perhaps we can both serve the revolution together.',
        awakeninglevelGain: 2,
        nextScene: 'europe-intro-transition',
      },
    ],
  },

  'europe-intro-transition': {
    id: 'europe-intro-transition',
    title: 'The Wanderer in Europe',
    location: 'Aboard the Salvadora, 1882',
    character: 'Transition',
    dialogue: '',
    portraitUrl: '',
    backgroundImage: '/images/backgrounds/ateneo_classroom.png',
    options: [{ text: 'Continue', nextScene: 'europe-intro' }],
    transitionImage: '/images/cg/europe_transition.png',
  },

  // CHAPTER 3: THE WANDERER IN EUROPE
  'europe-intro': {
    id: 'europe-intro',
    title: 'The Wanderer in Europe',
    location: 'Madrid, Spain, 1882',
    character: 'Mentor (Dr. Antonio Luna)',
    dialogue: 'Welcome to Europe, young Rizal. Here, you are free to think, to write, to challenge ideas without fear of the Inquisition. But do not be naive—Spain\'s reach is long. I have arranged for you to study medicine in Madrid, but your real education will come from the Filipino community here. We are building a movement. Marcelo del Pilar, Graciano Lopez Jaena, others—we are preparing something revolutionary. A novel that will expose the truth about the Philippines.',
    portraitUrl: '/images/characters/Juan_Antonio_Luna.png',
    backgroundImage: '/images/backgrounds/europe_street.png', // Anime European Street (Madrid)
    options: [
      {
        text: 'I will write this novel. It will be called "Noli Me Tangere."',
        skillRequired: 'literature',
        skillLevel: 3,
        awakeninglevelGain: 3,
        nextScene: 'europe-la-solidaridad',
      },
      {
        text: 'First, let me complete my medical studies and gather more knowledge.',
        skillRequired: 'medicine',
        skillLevel: 2,
        awakeninglevelGain: 2,
        nextScene: 'europe-la-solidaridad',
      },
      {
        text: 'I will do both—study and write. I will master every skill needed.',
        awakeninglevelGain: 3,
        nextScene: 'europe-la-solidaridad',
      },
    ],
    skillPointReward: 1,
  },

  'europe-la-solidaridad': {
    id: 'europe-la-solidaridad',
    title: 'A House Divided',
    location: 'Madrid, Spain, 1889',
    character: 'Marcelo H. del Pilar',
    dialogue: 'Pepe, La Solidaridad needs your voice, but we cannot have two captains steering one ship. Our compatriots are divided—some follow your vision of assimilation and moral education, while others align with my pragmatic, political approach. If we show the Spanish government a fractured front, all our writing is in vain. Who should lead the Filipino colony?',
    portraitUrl: '/images/characters/Marcelo_H_Del_Pilar.png', // Placeholder
    backgroundImage: '/images/backgrounds/europe_street.png',
    options: [
      {
        text: 'I will step aside. The cause is greater than my pride.',
        awakeninglevelGain: 2,
        nextScene: 'europe-berlin',
      },
      {
        text: 'I must lead. They need an ilustrado to guide them.',
        skillRequired: 'literature',
        skillLevel: 3,
        awakeninglevelGain: 3,
        nextScene: 'europe-berlin',
      },
      {
        text: 'Let us lead together as equals for the motherland.',
        awakeninglevelGain: 2,
        nextScene: 'europe-berlin',
      },
    ],
    skillPointReward: 1,
  },

  'europe-berlin': {
    id: 'europe-berlin',
    title: 'The Wanderer in Europe',
    location: 'Berlin, Germany, 1884',
    character: 'Fellow Intellectual (Ferdinand Blumentritt)',
    dialogue: 'Jose, your novel is brilliant—dangerous, but brilliant. The Spanish authorities have already noticed. But here in Berlin, you are safe. I have introduced you to scholars, scientists, thinkers. You have mastered multiple languages, studied medicine, learned fencing. You are becoming the complete man—the ilustrado your people need. But I must warn you: when you return to the Philippines, they will arrest you. They will torture you. Are you truly ready for that sacrifice?',
    portraitUrl: '/images/characters/Ferdinand_Blumentritt.png',
    backgroundImage: '/images/backgrounds/europe_street.png', // Anime European Street (Berlin)
    options: [
      {
        text: 'I am ready. My people need me more than I need my life.',
        skillRequired: 'literature',
        skillLevel: 4,
        awakeninglevelGain: 3,
        nextScene: 'dapitan-intro-transition',
      },
      {
        text: 'I will continue my work abroad, where I can write safely.',
        awakeninglevelGain: 1,
        nextScene: 'dapitan-intro-transition',
      },
      {
        text: 'I must return and see the situation for myself first.',
        awakeninglevelGain: 2,
        nextScene: 'dapitan-intro-transition',
      },
    ],
  },

  'dapitan-intro-transition': {
    id: 'dapitan-intro-transition',
    title: 'The Exile of Dapitan',
    location: 'Arrival at Dapitan, 1892',
    character: 'Transition',
    dialogue: '',
    portraitUrl: '',
    backgroundImage: '/images/backgrounds/europe_street.png',
    options: [{ text: 'Continue', nextScene: 'dapitan-josephine' }],
    transitionImage: '/images/cg/dapitan_transition.png',
  },

  'dapitan-josephine': {
    id: 'dapitan-josephine',
    title: 'An Unexpected Patient',
    location: 'Dapitan, Mindanao, 1895',
    character: 'Josephine Bracken',
    dialogue: 'Dr. Rizal, they told us you were the finest ophthalmic surgeon in the East. My foster father, Mr. Taufer, is losing his sight, and we traveled from Hong Kong hoping for a miracle. But arriving here... in this quiet place of exile, I did not expect to find someone so gentle, so misunderstood by the world. Will you help us?',
    portraitUrl: './images/characters/Josephine_Bracken.png',
    backgroundImage: '/images/backgrounds/dapitan_tropical.png',
    options: [
      {
        text: 'I will do everything in my power to restore his sight.',
        skillRequired: 'medicine',
        skillLevel: 3,
        awakeninglevelGain: 1,
        nextScene: 'dapitan-intro',
      },
      {
        text: 'I cannot promise a cure, but you are welcome here.',
        awakeninglevelGain: 2,
        nextScene: 'dapitan-intro',
      },
      {
        text: 'Your presence brings light to this dark exile, Josephine.',
        skillRequired: 'literature',
        skillLevel: 2,
        awakeninglevelGain: 1,
        nextScene: 'dapitan-intro',
      },
    ],
    skillPointReward: 1,
  },

  // CHAPTER 4: THE EXILE OF DAPITAN
  'dapitan-intro': {
    id: 'dapitan-intro',
    title: 'The Exile of Dapitan',
    location: 'Dapitan, Mindanao, 1892',
    character: 'Spanish Commander (Captain Blanco)',
    dialogue: 'Dr. Rizal, you are exiled here for your seditious writings. But I see you are not a violent man. You have established a school, you treat the sick, you improve the town. Perhaps the Spanish authorities were too harsh. Still, you are watched constantly. The Katipunan—this secret society—they claim you as their inspiration. Will you join them? Or will you continue your peaceful work here in exile?',
    portraitUrl: '/images/characters/Captain_Blanco.png',
    backgroundImage: '/images/backgrounds/dapitan_tropical.png', // Anime Tropical Hut (Dapitan)
    options: [
      {
        text: 'I will continue my peaceful work and refuse violence.',
        skillRequired: 'medicine',
        skillLevel: 3,
        awakeninglevelGain: 1,
        nextScene: 'ending-healer',
      },
      {
        text: 'I will support the Katipunan secretly while maintaining my cover.',
        skillRequired: 'languages',
        skillLevel: 3,
        awakeninglevelGain: 2,
        nextScene: 'ending-spy',
      },
      {
        text: 'I will flee and continue my work in exile, away from danger.',
        skillRequired: 'literature',
        skillLevel: 4,
        awakeninglevelGain: 1,
        nextScene: 'ending-exile',
      },
      {
        text: 'Josephine has given me reason to live. I choose love — I will stay and build a life with her.',
        skillRequired: 'literature',
        skillLevel: 3,
        awakeninglevelGain: 2,
        nextScene: 'ending-lover',
      },
      {
        text: 'I will join the Katipunan. Armed revolution is now necessary.',
        skillRequired: 'fencing',
        skillLevel: 3,
        awakeninglevelGain: 3,
        nextScene: 'trial-arrest',
      },
    ],
    skillPointReward: 3,
  },

  // CHAPTER 5: THE TRIAL AND FINAL DAYS

  'trial-arrest': {
    id: 'trial-arrest',
    title: 'Chains of Fate',
    location: 'Fort Santiago, Manila, November 1896',
    character: 'Spanish Interrogator (Col. Francisco Olive)',
    dialogue: 'Dr. Rizal. You are charged with rebellion, sedition, and forming illegal associations. We have testimony that you were the intellectual founder of the Katipunan. We have letters—your letters—read aloud in their secret rites. Your novels stirred the masses into revolt. The blood spilled in this uprising stains your hands as surely as if you had fired the guns yourself. What do you say for yourself?',
    portraitUrl: '/images/characters/Col_Francisco_Olive.png',
    backgroundImage: '/images/backgrounds/bagumbayan_field.png',
    options: [
      {
        text: 'I never sanctioned violence. My writings called for reform, not bloodshed.',
        skillRequired: 'literature',
        skillLevel: 3,
        awakeninglevelGain: 2,
        nextScene: 'trial-tribunal',
      },
      {
        text: 'I stand by every word I have written. The people\'s cause is just.',
        awakeninglevelGain: 3,
        nextScene: 'trial-tribunal',
      },
      {
        text: 'You cannot put ideas on trial. Truth is not sedition.',
        skillRequired: 'languages',
        skillLevel: 3,
        awakeninglevelGain: 2,
        nextScene: 'trial-tribunal',
      },
    ],
    skillPointReward: 1,
  },

  'trial-tribunal': {
    id: 'trial-tribunal',
    title: 'The Court of Lies',
    location: 'Military Court, Cuartel de España, December 1896',
    character: 'Judge Advocate (Lt. Col. Orbeta)',
    dialogue: 'The prosecution rests, Dr. Rizal. You have heard the testimonies. Witnesses swore they saw your name invoked at Katipunan rallies. Bonifacio\'s men carried copies of your Noli Me Tangere as sacred texts. Your own manifesto—written from Dapitan—was read as a call to arms. The Spanish Crown has shown you every courtesy; you repaid it with sedition. The tribunal has reached its verdict: Guilty on all three counts. Sentence—death by firing squad. Do you have final words for this court?',
    portraitUrl: '/images/characters/Lt_Col_Orbeta.png',
    backgroundImage: '/images/backgrounds/bagumbayan_field.png',
    options: [
      {
        text: 'I forgive you all. History will be my true judge.',
        skillRequired: 'literature',
        skillLevel: 4,
        awakeninglevelGain: 3,
        nextScene: 'trial-final-night-transition',
      },
      {
        text: 'This verdict is unjust. But I will meet death with my head held high.',
        awakeninglevelGain: 2,
        nextScene: 'trial-final-night-transition',
      },
      {
        text: 'You execute a man, but you cannot execute an idea.',
        awakeninglevelGain: 3,
        nextScene: 'trial-final-night-transition',
      },
    ],
    skillPointReward: 1,
  },

  'trial-final-night-transition': {
    id: 'trial-final-night-transition',
    title: 'Mi Último Adiós',
    location: 'Fort Santiago, December 29, 1896',
    character: 'Transition',
    dialogue: '',
    portraitUrl: '',
    backgroundImage: '/images/backgrounds/bagumbayan_field.png',
    options: [{ text: 'Continue', nextScene: 'trial-final-night' }],
    transitionImage: '/images/cg/trial_final_night_transition.png',
  },

  'trial-final-night': {
    id: 'trial-final-night',
    title: 'Mi Último Adiós',
    location: 'Fort Santiago, December 29, 1896 — The Night Before',
    character: 'Josephine Bracken',
    dialogue: 'Jose... they will not let me stay long. I brought paper and pen, as you asked. They say tomorrow at dawn... I cannot say it. I will not say it. The sisters found your retraction letter—did you truly sign it? Was it coerced? You must tell me. But whatever comes... I have loved you more than I can say. More than any revolution. More than any novel. Just you.',
    portraitUrl: '/images/characters/Josephine_Bracken.png',
    backgroundImage: '/images/backgrounds/bagumbayan_field.png',
    options: [
      {
        text: 'The retraction was forced. My true testament is the poem I am writing tonight—"Mi Último Adiós."',
        skillRequired: 'literature',
        skillLevel: 4,
        awakeninglevelGain: 3,
        nextScene: 'ending-revolutionary',
      },
      {
        text: 'Tell Paciano, tell my family—I die without guilt. The pen was always mightier.',
        awakeninglevelGain: 2,
        nextScene: 'ending-revolutionary',
      },
      {
        text: 'My love—hide this poem in your shoe when you leave. Let it reach the world.',
        awakeninglevelGain: 2,
        nextScene: 'ending-revolutionary',
      },
    ],
    skillPointReward: 2,
  },

  // ENDING 1: THE HISTORICAL MARTYR
  'ending-revolutionary': {
    id: 'ending-revolutionary',
    title: 'The Revolutionary Martyr',
    location: 'Bagumbayan, Manila, December 30, 1896',
    character: 'Narrator',
    dialogue: 'The morning of December 30, 1896 broke cold and grey over Bagumbayan field. You walked calmly among your guards, your hidden poem already smuggled out inside Josephine\'s shoe. Before the firing squad you asked to face them—it was denied. They feared even your dying gaze. As the rifles cracked, you managed to turn, to face the sky, to fall looking up at the sun you had written of in your final verse: "Farewell, dear Fatherland, clime of the sun caressed…" The crowd was silent. Then, as if from nowhere, a woman wept. Then another. Then a thousand voices rose. The revolution had its martyr. The nation had its soul.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Jose_Rizal_full.jpg',
    backgroundImage: '/images/backgrounds/bagumbayan_field.png',
    options: [],
  },

  // ENDING 2: THE HEALER'S LEGACY
  'ending-healer': {
    id: 'ending-healer',
    title: 'The Healer\'s Legacy (What-If)',
    location: 'Dapitan, Mindanao, 1900',
    character: 'Narrator',
    dialogue: 'You refused to join the armed rebellion, instead dedicating yourself to healing. Your school in Dapitan became a beacon of education and medicine. When the revolution ended, you were pardoned for your peaceful stance. You spent your remaining years as a doctor, treating the poor and establishing hospitals. Your legacy became one of compassion rather than bloodshed. Some say you saved more lives through medicine than any soldier could have through warfare.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Jose_Rizal_full.jpg',
    backgroundImage: '/images/backgrounds/dapitan_tropical.png', // Anime Tropical (Dapitan)
    options: [],
  },

  // ENDING 3: THE SILENT OPERATIVE
  'ending-spy': {
    id: 'ending-spy',
    title: 'The Silent Operative (What-If)',
    location: 'Underground Network, Philippines, 1898',
    character: 'Narrator',
    dialogue: 'You became the Katipunan\'s greatest asset—a spy in plain sight. Using your languages and diplomatic skills, you gathered intelligence from Spanish officials, smuggled weapons, and coordinated with international allies. When the Spanish-American War erupted, your intelligence network proved invaluable. You were never caught, never publicly identified. The revolution succeeded, and you disappeared into history as an unknown hero. Some say you lived out your days in exile, watching your nation gain independence from afar.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Jose_Rizal_full.jpg',
    backgroundImage: '/images/backgrounds/underground_spy.png', // Anime Street (Spy)
    options: [],
  },

  // ENDING 4: THE ETERNAL EXILE
  'ending-exile': {
    id: 'ending-exile',
    title: 'The Eternal Exile (What-If)',
    location: 'Paris, France, 1898',
    character: 'Narrator',
    dialogue: 'You fled the Philippines and never returned. From the safety of Europe, you continued writing—novels, essays, letters. Your works reached the Filipino diaspora and inspired movements for independence. While others fought and died, you lived comfortably, your pen your only weapon. The revolution succeeded without you. Some call you a coward for abandoning your people. Others say you were a visionary who understood that ideas are more powerful than bullets. Your legacy remains contested—neither hero nor villain, but something in between.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Jose_Rizal_full.jpg',
    backgroundImage: '/images/backgrounds/europe_street.png', // Anime Street (Exile/Europe)
    options: [],
  },

  // ENDING 5: THE LOVER'S ENDING
  'ending-lover': {
    id: 'ending-lover',
    title: 'The Lover\'s Choice (What-If)',
    location: 'Dapitan, Mindanao, 1895',
    character: 'Narrator',
    dialogue: 'When Josephine Bracken arrived in Dapitan seeking a cure for her ailing foster father, she found more than a doctor—she found a soulmate. You had loved before: Leonor Rivera, who waited faithfully across an ocean; O-Sei-San, the gentle Japanese woman whose kindness touched your heart; Consuelo Ortiga, whose beauty first stirred the poet in you. But Josephine was different. She stayed. In her eyes you saw a home, not a battlefield. You chose her—choosing life, laughter, and a small patch of earth in Dapitan over the roar of cannon fire. History would not remember you as a martyr. But every evening, as the fireflies lit the garden you built together, you would read aloud your poetry, and she would listen, and for once the nation\'s sorrows felt distant. They say the revolution still came—Bonifacio led it without you. They say the Philippines found its freedom eventually. And perhaps, in a life fully lived beside the one you loved, you found yours too.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Josephine_Bracken.jpg',
    backgroundImage: '/images/backgrounds/dapitan_tropical.png', // Anime Tropical (Lover)
    options: [],
  },
};

export default function Game() {
  const { gameState, updateAwakeningLevel, advanceScene, resetGame, completePuzzle } = useGame();
  const audio = useAudio();
  const [currentScreen, setCurrentScreen] = useState<'title' | 'game' | 'end'>('title');
  const [hasProgress, setHasProgress] = useState(gameState.dialogueHistory.length > 0);
  const [endingType, setEndingType] = useState<string>('ending-revolutionary');
  const [showOptions, setShowOptions] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [showLocationIntro, setShowLocationIntro] = useState(true);

  useEffect(() => {
    setShowLocationIntro(true);
  }, [gameState.currentScene]);

  const currentScene = STORY_SCENES[gameState.currentScene];
  const currentPuzzleId = `puzzle-${gameState.currentScene}`;
  const hasPuzzleForScene = Object.keys(PUZZLE_LIBRARY).includes(currentPuzzleId);
  const isPuzzleCompleted = gameState.completedPuzzles.includes(currentPuzzleId);
  const showPuzzleOverlay = hasPuzzleForScene && !isPuzzleCompleted;

  // Handle music for current scene
  useEffect(() => {
    if (currentScreen === 'title') {
      const titleMusic = getMusicForScene('title-theme');
      if (titleMusic) {
        audio.play(titleMusic);
      }
    } else if (currentScreen === 'game' && currentScene) {
      const sceneMusic = getMusicForScene(currentScene.id);
      if (sceneMusic) {
        audio.fadeOut(500);
        setTimeout(() => {
          audio.play(sceneMusic);
          audio.fadeIn(500);
        }, 500);
      }
    } else if (currentScreen === 'end') {
      const endingMusic = getMusicForEnding(endingType);
      if (endingMusic) {
        audio.fadeOut(500);
        setTimeout(() => {
          audio.play(endingMusic);
          audio.fadeIn(500);
        }, 500);
      }
    }
  }, [currentScreen, currentScene?.id, endingType]);

  const handleStart = () => {
    resetGame();
    setCurrentScreen('game');
    setHasProgress(true);
  };

  const handleResume = () => {
    setCurrentScreen('game');
    audio.resume();
  };

  const handleOptions = () => {
    setShowOptions(true);
  };

  const handleOptionSelect = (option: DialogueOption) => {
    if (option.awakeninglevelGain) {
      updateAwakeningLevel(option.awakeninglevelGain);
    }

    if (option.nextScene?.startsWith('ending-')) {
      setEndingType(option.nextScene);
      setCurrentScreen('end');
    } else if (option.nextScene) {
      advanceScene(option.nextScene);
    }
  };

  if (currentScreen === 'title') {
    return (
      <>
        <TitleScreen onStart={handleStart} onResume={handleResume} onOptions={handleOptions} hasProgress={hasProgress} />
        <GameDrawer
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
          volume={audio.volume}
          onVolumeChange={audio.setVolume}
          isPlaying={audio.isPlaying}
          onToggleMusic={() => (audio.isPlaying ? audio.pause() : audio.resume())}
          completedPuzzles={gameState.completedPuzzles}
          visitedScenes={gameState.visitedScenes}
        />
      </>
    );
  }

  if (currentScreen === 'end') {
    return (
      <>
        <EndScreen
          stats={{
            totalChoicesMade: gameState.choices.length,
            skillPointsEarned: gameState.skillPointsAvailable + Object.values(gameState.skills).reduce((a, b) => a + b, 0),
            awakeninglevelReached: gameState.awakeninglevel,
            dialoguesRead: gameState.dialogueHistory.length,
            pathsTaken: gameState.choices.slice(0, 5),
            finalSkills: gameState.skills,
          }}
          onReturnToTitle={() => setCurrentScreen('title')}
          endingType={endingType}
        />
        <GameDrawer
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
          volume={audio.volume}
          onVolumeChange={audio.setVolume}
          isPlaying={audio.isPlaying}
          onToggleMusic={() => (audio.isPlaying ? audio.pause() : audio.resume())}
          completedPuzzles={gameState.completedPuzzles}
          visitedScenes={gameState.visitedScenes}
        />
      </>
    );
  }


  return (
    <div className="min-h-screen w-full bg-background">
      {currentScene && (
        <ImmersiveScene backgroundImage={currentScene.backgroundImage}>
          <div className="w-full h-full relative">
            {/* Drawer Button */}
            <div className="absolute top-4 left-4 z-40">
              <Button
                onClick={() => setShowOptions(true)}
                variant="default"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg font-semibold flex items-center gap-2"
                title="Open options"
              >
                <Settings className="w-5 h-5" />
                <span>Options</span>
              </Button>
            </div>

            {/* Location Intro */}
            <AnimatePresence>
              {showLocationIntro && (
                <LocationIntro
                  key={currentScene.id}
                  title={currentScene.title}
                  location={currentScene.location}
                  onComplete={() => setShowLocationIntro(false)}
                />
              )}
            </AnimatePresence>

            {/* Image Transition Overlay */}
            {!showLocationIntro && currentScene.transitionImage && (
              <ImageTransition
                imageUrl={currentScene.transitionImage}
                onComplete={() => {
                  const nextSceneId = currentScene.options[0]?.nextScene;
                  if (nextSceneId) {
                    advanceScene(nextSceneId);
                  }
                }}
              />
            )}

            {/* Puzzle Overlay */}
            {!showLocationIntro && !currentScene.transitionImage && (
              showPuzzleOverlay ? (
                <PuzzleGame
                  imageUrl={PUZZLE_LIBRARY[currentPuzzleId].imageUrl}
                  sceneTitle={PUZZLE_LIBRARY[currentPuzzleId].title}
                  onComplete={() => completePuzzle(currentPuzzleId)}
                  onSkip={() => completePuzzle(currentPuzzleId)}
                />
              ) : (
                /* Dialogue Box */
                <TransparentDialogueBox
                  character={currentScene.character}
                  dialogue={currentScene.dialogue}
                  options={currentScene.options}
                  portraitUrl={currentScene.portraitUrl}
                  sceneId={currentScene.id}
                  skillPointReward={currentScene.skillPointReward}
                  onOptionSelect={handleOptionSelect}
                  onOpenSkills={() => setIsSkillsOpen(true)}
                />
              )
            )}
          </div>
        </ImmersiveScene>
      )}
      {/* Drawer for Options */}
      <GameDrawer
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        volume={audio.volume}
        onVolumeChange={audio.setVolume}
        isPlaying={audio.isPlaying}
        onToggleMusic={() => (audio.isPlaying ? audio.pause() : audio.resume())}
        completedPuzzles={gameState.completedPuzzles}
        visitedScenes={gameState.visitedScenes}
      />
      {/* Skill Tree Drawer */}
      <SkillDrawer
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
      />
    </div>
  );
}
