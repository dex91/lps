export interface QuestionRAW{
  id: Number,
  q_poolId: Number,
  q_title: String,
  q_answer_type: Number,
  q_answers?: String[],
  q_helptext: String,
  q_points: Number,
  q_created: Number,
  q_edited?: Number,
  q_createdby?: String,
}

export interface Question{
  id: Number,
  q_poolId: Number,
  q_title: String,
  q_answer_type: Number,
  q_answers?: String[],
  q_helptext: String,
  q_points: Number,
  q_created: Date,
  q_edited: Date,
  q_createdby?: String,
  q_answered: Boolean,
}

export interface Answer{
  id: Number,
  answers: String[],
}

export interface QuestionPool{
  id?: Number,
  poolURIName?: String,
  poolName?: String,
  poolSize?: Number,
}

export interface Modus{
  mode: String,
  pruefungsmodus?: Boolean,
  teilpruefung?: Boolean,
  lernmodus?: Boolean,
}

export interface examValue {
  examStarted?: Boolean,
  examFailed?: Boolean,
  examDone?: Boolean,
  examRightQuestion?: number,
  examFailedQuestion?: number,
  examQuestions?: number,
  examProgress?: number,
  examTimer?: any,
  examReasons?: Number,
  examProgressPercent?: number,
  warning?: Boolean,
  showProgress?: Boolean,
  exit?: Boolean,
}

export interface examTimer {
  tick?: Boolean
}
