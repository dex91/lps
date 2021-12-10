export interface Question{
  id: Number,
  q_title: String,
  q_answer_type: Number,
  q_answers?: String[],
  q_helptext: String,
  q_points: Number,
  q_created?: Date,
  q_edited?: Date,
  q_createdby?: String,
  q_answered: Boolean,
}

export interface QuestionPool{
  poolId: Number,
  poolName: String,
  poolQuestions: Number,
}

export const questionPools: QuestionPool[] = [
  {
    poolId: 1,
    poolName: "LPIC-01",
    poolQuestions: 12,
  },
];


export const questions: Question[] = [
  {
  id: 1,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 1,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,
},
{
  id: 2,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 2,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 3,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 3,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 4,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 3,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 5,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 2,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 6,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 1,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 7,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 2,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 8,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 3,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 9,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 1,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 10,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 2,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 10,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 3,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 11,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 2,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
{
  id: 12,
  q_title: "Wie lautet die Hauptstadt von NRW?",
  q_answer_type: 1,
  q_helptext: "NRW liegt als Bundesland im Westen von Deutschland. Bayern z.b. im Süden.",
  q_points: 3,
  q_createdby: "b.aranda@outlook.de",
  q_answered: false,

},
];
